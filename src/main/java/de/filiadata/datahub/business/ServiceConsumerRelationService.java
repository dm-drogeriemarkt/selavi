package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceConsumerRelation;
import de.filiadata.datahub.repository.ServiceConsumerRelationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class ServiceConsumerRelationService {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceConsumerRelationService.class);
    private ServiceConsumerRelationRepository serviceConsumerRelationRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public ServiceConsumerRelationService(ServiceConsumerRelationRepository serviceConsumerRelationRepository,
                                          DefaultNodeContentFactory defaultNodeContentFactory) {
        this.serviceConsumerRelationRepository = serviceConsumerRelationRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public Collection<ObjectNode> getConsumerRelations() {
        final Iterable<ServiceConsumerRelation> allRelations = serviceConsumerRelationRepository.findAll();
        final List<ObjectNode> result = new ArrayList<>();
        allRelations.forEach(relation -> {
            try {
                ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(relation.getContent());
                result.add(node);
            } catch (IOException e) {
                LOG.info("Relation with ID '{}' is corrupted and will be skipped.", relation.getId(), e);
            }
        });

        return result;
    }

    public void createNewConsumerRelation(String serviceName, List<String> consumedServiceIds) {
        // TODO: check if service exists
        final ObjectNode objectNode = defaultNodeContentFactory.create(serviceName);
        final ArrayNode arrayNode = aggregateConsumersForNode(consumedServiceIds);
        objectNode.put("consumes", arrayNode);

        final ServiceConsumerRelation serviceConsumerRelation = new ServiceConsumerRelation(serviceName, objectNode.toString());
        serviceConsumerRelationRepository.save(serviceConsumerRelation);
    }

    private ArrayNode aggregateConsumersForNode(List<String> consumedServiceIds) {
        final ArrayNode arrayNode = defaultNodeContentFactory.getMapper().createArrayNode();
        if (consumedServiceIds != null) {
            for (String consumedId : consumedServiceIds) {
                arrayNode.add(consumedId);
            }
        }
        return arrayNode;
    }
}
