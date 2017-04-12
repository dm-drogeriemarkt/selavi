package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Iterator;

@Component
class RelationArrayNodeMerger {

    private static final String TARGET = "target";
    private static final String TYPE = "type";

    JsonNode merge(JsonNode existingConsumerArrayNode, JsonNode updatedConsumerNode) throws IOException {

        ArrayNode mergedNode = JsonNodeFactory.instance.arrayNode();

        // iterate through all entries in existingConsumerArrayNode
        for (JsonNode existingConsumer : existingConsumerArrayNode) {

            ObjectNode newConsumer = JsonNodeFactory.instance.objectNode();

            newConsumer.put(TARGET, existingConsumer.get(TARGET).asText());

            if (existingConsumer.get(TARGET).equals(updatedConsumerNode.get(TARGET))) {
                newConsumer.put(TYPE, updatedConsumerNode.get(TYPE));
            } else {
                newConsumer.put(TYPE, existingConsumer.get(TYPE).asText());
            }

            mergedNode.add(newConsumer);
        }
        return mergedNode;
    }
}
