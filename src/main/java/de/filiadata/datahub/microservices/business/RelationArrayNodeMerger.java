package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
class RelationArrayNodeMerger {

    private static final String TARGET = "target";
    private static final String TYPE = "type";

    JsonNode merge(JsonNode existingConsumerArrayNode, JsonNode updatedConsumerNode) throws IOException {

        ArrayNode mergedNode = JsonNodeFactory.instance.arrayNode();

        // iterate through all entries in existingConsumerArrayNode
        for (JsonNode existingConsumer : existingConsumerArrayNode) {

            ObjectNode newConsumer = JsonNodeFactory.instance.objectNode();

            newConsumer.put(TARGET, existingConsumer.get(TARGET).textValue());

            if (existingConsumer.get(TARGET).equals(updatedConsumerNode.get(TARGET))) {
                newConsumer.put(TYPE, updatedConsumerNode.get(TYPE).textValue());
            } else {
                JsonNode typeNode = existingConsumer.get(TYPE);
                String typeValue = (null == typeNode) ? "" : typeNode.textValue();
                newConsumer.put(TYPE, typeValue);
            }

            mergedNode.add(newConsumer);
        }
        return mergedNode;
    }
}
