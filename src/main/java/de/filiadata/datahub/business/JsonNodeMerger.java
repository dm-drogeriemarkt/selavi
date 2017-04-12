package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Iterator;

@Component
class JsonNodeMerger {

    private static final String TARGET = "target";
    private static final String TYPE = "type";

    JsonNode merge(JsonNode mainNode, JsonNode updateNode) throws IOException {

        ObjectNode mergedNode = JsonNodeFactory.instance.objectNode();

        // iterate through all entries in mainNode
        for (JsonNode main : mainNode) {

            ObjectNode instance = JsonNodeFactory.instance.objectNode();

            // get all target-type objects from main
            Iterator<String> mainFieldNames = main.fieldNames();
            while (mainFieldNames.hasNext()) {

                String mainKey = mainFieldNames.next();
                JsonNode mainValue = main.get(mainKey);

                if (mainKey.equals(TARGET)) {
                    instance.put(TARGET, mainValue);

                    // get all target-type objects from update
                    Iterator<String> updateFieldNames = updateNode.fieldNames();
                    while (updateFieldNames.hasNext()) {

                        String updateKey = updateFieldNames.next();
                        JsonNode updateValue = updateNode.get(mainKey);

                        // main target value = update target value?
                        if (updateValue.equals(mainValue)) {
                            // do update type value
                            if (updateKey.equals(TYPE) && !mainValue.equals(updateValue)) {
                                instance.put(mainKey, updateValue);
                            }
                        }
                    }

                } else if (mainKey.equals(TYPE)) {

                    // put in original value
                    instance.put(TYPE, mainValue);
                }
            }
            mergedNode.put("", instance);
        }
        return mergedNode;
    }
}
