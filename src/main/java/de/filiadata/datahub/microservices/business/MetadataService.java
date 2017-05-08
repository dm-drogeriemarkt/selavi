package de.filiadata.datahub.microservices.business;

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

        final Iterator<String> iter = objectNode.fieldNames();
        while (iter.hasNext()) {
            final String fieldName = iter.next();
            final JsonNode jsonNode = objectNode.get(fieldName);
            if (jsonNode.isValueNode()) {
                result.put(fieldName, jsonNode.asText());
            }
        }


        return result;

    }


}
