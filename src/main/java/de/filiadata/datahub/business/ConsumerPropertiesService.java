package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.semanticexceptions.RelationAddException;
import de.filiadata.datahub.business.semanticexceptions.RelationRemoveException;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Iterator;
import java.util.Optional;

@Service
public class ConsumerPropertiesService {

    private static final String CONSUMER_NODE_NAME = "consumes";
    private static final String TARGET = "target";

    private final ServicePropertiesRepository servicePropertiesRepository;
    private final DefaultNodeContentFactory defaultNodeContentFactory;
    private final RelationArrayNodeMerger relationArrayNodeMerger;

    @Autowired
    public ConsumerPropertiesService(ServicePropertiesRepository servicePropertiesRepository,
                                     DefaultNodeContentFactory defaultNodeContentFactory,
                                     RelationArrayNodeMerger relationArrayNodeMerger) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
        this.relationArrayNodeMerger = relationArrayNodeMerger;
    }

    public ServiceProperties saveOrMergeRelationProperties(String serviceName, ObjectNode newRelationProperties, Optional<JsonNode> existingRelationProperties) throws IOException {
        if (!existingRelationProperties.isPresent()) {
            return saveRelationProperties(serviceName, newRelationProperties);
        } else {
            return mergeRelationProperties(serviceName, newRelationProperties, existingRelationProperties.get());
        }
    }

    public ServiceProperties saveRelationProperties(String serviceName, ObjectNode relationProperties) throws IOException {
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        final ObjectMapper mapper = defaultNodeContentFactory.getMapper();
        final ObjectNode existingNode = (ObjectNode) mapper.readTree(serviceProperties.getContent());

        boolean consumerNodeExists = existingNode.hasNonNull(CONSUMER_NODE_NAME);
        if (consumerNodeExists) {

            if (serviceName.equals(relationProperties.get(TARGET).asText())) {
                throw new RelationAddException();
            }

            final ArrayNode existingConsumesProperties = (ArrayNode) existingNode.get(CONSUMER_NODE_NAME);

            Optional<ObjectNode> relation = getRelation(existingConsumesProperties, relationProperties);
            if (relation.isPresent()) {
                relation.get().setAll(relationProperties);
            } else {
                existingConsumesProperties.add(relationProperties);
            }

            serviceProperties.setContent(existingNode.toString());
            return servicePropertiesRepository.save(serviceProperties);
        }

        final ArrayNode newConsumerNode = createConsumerNode(relationProperties);
        existingNode.set(CONSUMER_NODE_NAME, newConsumerNode);
        serviceProperties.setContent(existingNode.toString());
        return servicePropertiesRepository.save(serviceProperties);
    }

    public ServiceProperties mergeRelationProperties(String serviceName, ObjectNode newRelationProperties, JsonNode existingRelationProperties) throws IOException {

        JsonNode jsonNewRelationProperties = new ObjectMapper().readTree(newRelationProperties.toString());
        JsonNode mergedRelationProperties = relationArrayNodeMerger.merge(existingRelationProperties, jsonNewRelationProperties);

        final ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
        contentNode.set(CONSUMER_NODE_NAME, mergedRelationProperties);

        final ServiceProperties newServiceProperties = new ServiceProperties(serviceName, contentNode.toString());
        return servicePropertiesRepository.save(newServiceProperties);
    }


    private Optional<ObjectNode> getRelation(ArrayNode arrayNode, ObjectNode relationProperties) {
        for (Iterator<JsonNode> it = arrayNode.iterator(); it.hasNext(); ) {
            JsonNode node = it.next();
            if (node.get(TARGET).textValue().equals(relationProperties.get(TARGET).textValue())) {
                return Optional.of((ObjectNode) node);
            }
        }
        return Optional.empty();
    }

    public ServiceProperties createAndSaveNewProperties(String serviceName, ObjectNode relationProperties) {
        final ArrayNode consumerNode = createConsumerNode(relationProperties);
        final ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
        contentNode.set(CONSUMER_NODE_NAME, consumerNode);

        final ServiceProperties newServiceProperties = new ServiceProperties(serviceName, contentNode.toString());
        return servicePropertiesRepository.save(newServiceProperties);
    }

    private ArrayNode createConsumerNode(ObjectNode relatedServiceName) {
        ArrayNode consumerNode = defaultNodeContentFactory.getMapper().createArrayNode();
        consumerNode.add(relatedServiceName);
        return consumerNode;
    }

    public void removeRelation(String serviceName, String relatedServiceName) {
        if (StringUtils.isEmpty(relatedServiceName)) {
            throw new RelationRemoveException();
        }

        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        if (serviceProperties == null) {
            throw new RelationRemoveException();
        }

        final ObjectNode existingServiceNode = convertJsonToNode(serviceProperties);
        final ObjectNode modifiedConsumers = removeRelatedServiceNameNode(relatedServiceName, existingServiceNode);

        serviceProperties.setContent(modifiedConsumers.toString());
        servicePropertiesRepository.save(serviceProperties);
    }

    private ObjectNode convertJsonToNode(ServiceProperties serviceProperties) {
        final ObjectMapper mapper = defaultNodeContentFactory.getMapper();
        try {
            return (ObjectNode) mapper.readTree(serviceProperties.getContent());
        } catch (IOException e) {
            throw new RelationRemoveException(e);
        }
    }

    private ObjectNode removeRelatedServiceNameNode(String relatedServiceName, ObjectNode existingNode) {
        final ObjectNode resultNode = defaultNodeContentFactory.getMapper().createObjectNode();
        resultNode.setAll(existingNode);

        final ArrayNode consumer = (ArrayNode) resultNode.get(CONSUMER_NODE_NAME);
        if (consumer.size() == 0) {
            throw new RelationRemoveException();
        }

        for (Iterator<JsonNode> it = consumer.iterator(); it.hasNext(); ) {
            final JsonNode node = it.next();
            if (node.get(TARGET).textValue().equals(relatedServiceName)) {
                it.remove();
                return resultNode;
            }
        }

        throw new RelationRemoveException();
    }
}
