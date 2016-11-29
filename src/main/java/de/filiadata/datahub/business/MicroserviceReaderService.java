package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class MicroserviceReaderService {

    private RestTemplate restTemplate;

    @Autowired
    public MicroserviceReaderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, String> readServices() {
        // TODO: extract URL to config
        final ObjectNode objectNode = restTemplate.getForObject("https://example.com/", ObjectNode.class);
        final JsonNode jsonNode = objectNode.get("_links");
        final Iterator<String> fieldNames = jsonNode.fieldNames();

        Map<String, String> result = new HashMap<>();
        fieldNames.forEachRemaining(name -> {
            JsonNode nodeValue = jsonNode.get(name);
            result.put(name, nodeValue.get("href").toString());
        });

        return result;
    }
}
