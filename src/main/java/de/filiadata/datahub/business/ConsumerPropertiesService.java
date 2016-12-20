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

@Service
public class ConsumerPropertiesService {

    private static final String CONSUMER_NODE_NAME = "consumes";

    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public ConsumerPropertiesService(ServicePropertiesRepository servicePropertiesRepository,
                                     DefaultNodeContentFactory defaultNodeContentFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public ServiceProperties addConsumedService(String serviceName, String relatedServiceName) throws IOException {
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        final ObjectMapper mapper = defaultNodeContentFactory.getMapper();
        final ObjectNode existingNode = (ObjectNode) mapper.readTree(serviceProperties.getContent());

        boolean consumerNodeExists = existingNode.hasNonNull(CONSUMER_NODE_NAME);
        if (consumerNodeExists) {
            final ArrayNode existingConsumerNode = (ArrayNode) existingNode.get(CONSUMER_NODE_NAME);
            if (relationExists(existingConsumerNode, relatedServiceName)) {
                throw new RelationAddException();
            }

            existingConsumerNode.add(relatedServiceName);
            serviceProperties.setContent(existingNode.toString());
            return servicePropertiesRepository.save(serviceProperties);
        }

        final ArrayNode newConsumerNode = createConsumerNode(relatedServiceName);
        existingNode.set(CONSUMER_NODE_NAME, newConsumerNode);
        serviceProperties.setContent(existingNode.toString());
        return servicePropertiesRepository.save(serviceProperties);
    }

    private boolean relationExists(ArrayNode arrayNode, String relatedServiceName) {
        for (Iterator<JsonNode> it = arrayNode.iterator(); it.hasNext(); ) {
            JsonNode node = it.next();
            if (node.textValue().equals(relatedServiceName)) {
                return true;
            }
        }
        return false;
    }

    public ServiceProperties createAndSaveNewProperties(String serviceName, String relatedServiceName) {
        final ArrayNode consumerNode = createConsumerNode(relatedServiceName);
        final ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
        contentNode.set(CONSUMER_NODE_NAME, consumerNode);

        final ServiceProperties newServiceProperties = new ServiceProperties(serviceName, contentNode.toString());
        return servicePropertiesRepository.save(newServiceProperties);
    }

    private ArrayNode createConsumerNode(String relatedServiceName) {
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
        for (Iterator<JsonNode> it = consumer.iterator(); it.hasNext(); ) {
            final JsonNode node = it.next();
            if (node.textValue().equals(relatedServiceName)) {
                it.remove();
            }
        }

        if (consumer.size() == 0) {
            resultNode.remove(CONSUMER_NODE_NAME);
        }

        return resultNode;
    }
}
