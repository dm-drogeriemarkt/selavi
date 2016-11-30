package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ConsumerRelation;
import de.filiadata.datahub.repository.ConsumerRelationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class ConsumerRelationService {

    private ConsumerRelationRepository consumerRelationRepository;

    @Autowired
    public ConsumerRelationService(ConsumerRelationRepository consumerRelationRepository) {
        this.consumerRelationRepository = consumerRelationRepository;
    }

    public Collection<ObjectNode> getConsumerRelations() {
        final Iterable<ConsumerRelation> allRelations = consumerRelationRepository.findAll();
        final ObjectMapper mapper = new ObjectMapper();
        final List<ObjectNode> result = new ArrayList<>();
        allRelations.forEach(relation -> {
            try {
                ObjectNode node = (ObjectNode) mapper.readTree(relation.getContent());
                result.add(node);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return result;
    }

    public void createNewConsumerRelation(String serviceName, List<String> consumedServiceIds) {
        final ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("id", serviceName);
        objectNode.put("label", serviceName);

        final ArrayNode arrayNode = collectConsumers(consumedServiceIds, objectMapper);
        objectNode.put("consumes", arrayNode);

        final ConsumerRelation consumerRelation = new ConsumerRelation(serviceName, objectNode.toString());
        consumerRelationRepository.save(consumerRelation);
    }

    private ArrayNode collectConsumers(List<String> consumedServiceIds, ObjectMapper objectMapper) {
        final ArrayNode arrayNode = objectMapper.createArrayNode();
        if (consumedServiceIds != null) {
            for (String consumedId : consumedServiceIds) {
                arrayNode.add(consumedId);
            }
        }
        return arrayNode;
    }
}
