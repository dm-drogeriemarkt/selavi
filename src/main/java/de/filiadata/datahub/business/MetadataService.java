package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class MetadataService {

    private final PropertiesContentProviderService propertiesContentProviderService;

    public MetadataService(PropertiesContentProviderService propertiesContentProviderService) {
        this.propertiesContentProviderService = propertiesContentProviderService;
    }

    public Map<String, String> getMetadataForMicroservice(final String microserviceId) {

        final Map<String, String> result = new HashMap<>();

        final Map<String, ObjectNode> allServicesWithContent = propertiesContentProviderService.getAllServicesWithContent();
        final ObjectNode objectNode = allServicesWithContent.get(microserviceId);
        if (objectNode == null) {
            return Collections.emptyMap();
        }
        final JsonNode metadata = objectNode.get("metadata");
        if (metadata == null || metadata.size() < 1) {
            return Collections.emptyMap();

        }
        final JsonNode metaDataNode = metadata.get(0);
        final Iterator<String> iter = metaDataNode.fieldNames();
        while (iter.hasNext()) {
            final String fieldName = iter.next();
            final JsonNode jsonNode = metaDataNode.get(fieldName);
            result.put(fieldName, getValueFromArrayNode(jsonNode));
        }


        return result;

    }


    private String getValueFromArrayNode(JsonNode jsonNode) {
        if (jsonNode.size() > 0) {
            return jsonNode.get(0).asText();
        }

        return null;
    }

}
