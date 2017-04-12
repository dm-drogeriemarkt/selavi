package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Iterator;

@Component
class JsonNodeMerger {

    JsonNode merge(JsonNode mainNode, JsonNode updateNode) throws IOException {

        ObjectNode mergedNode = JsonNodeFactory.instance.objectNode();

        // iterate through all entries in mainNode
        for (JsonNode main : mainNode) {

            // get all target-type objects from main
            Iterator<String> mainFieldNames = main.fieldNames();
            while (mainFieldNames.hasNext()) {

                String mainFieldName = mainFieldNames.next();

                // put in original value
                mergedNode.put(mainFieldName, main.get(mainFieldName));

                // get all target-type objects from update
                Iterator<String> updateFieldNames = updateNode.fieldNames();
                while (updateFieldNames.hasNext()) {

                    String updateFieldName = updateFieldNames.next();

                    // do update
                    if (mainFieldName.equals(updateFieldName)) {
                        mergedNode.put(mainFieldName, updateNode.get(mainFieldName));
                    }
                }
            }
        }
        return mergedNode;
    }
}
