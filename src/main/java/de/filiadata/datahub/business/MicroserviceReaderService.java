package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class MicroserviceReaderService {

    private static final String KEY_ID = "id";
    private static final String KEY_LABEL = "label";
    private static final String KEY_MICROSERVICE_URL = "microservice-url";
    private RestTemplate restTemplate;

    @Autowired
    public MicroserviceReaderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Read all services from the internal microservice gateway and return a map with the service name and its url
     */
    public Map<String, ObjectNode> readServices() {
        // TODO: extract URL to config
        final ObjectNode objectNode = restTemplate.getForObject("https://example.com/", ObjectNode.class);
        final JsonNode jsonNode = objectNode.get("_links");
        final Iterator<String> fieldNames = jsonNode.fieldNames();

        final ObjectMapper mapper = new ObjectMapper();
        final Map<String, ObjectNode> result = new HashMap<>();
        fieldNames.forEachRemaining(name -> {
            final JsonNode nodeValue = jsonNode.get(name);
            final String microserviceUrl = nodeValue.get("href").toString();
            final ObjectNode resultNode = createResultNode(mapper, name, microserviceUrl);
            result.put(name, resultNode);
        });

        return result;
    }

    private ObjectNode createResultNode(ObjectMapper mapper, String name, String microserviceUrl) {
        final ObjectNode resultNode = mapper.createObjectNode();
        resultNode.put(KEY_ID, name);
        resultNode.put(KEY_LABEL, name);
        resultNode.put(KEY_MICROSERVICE_URL, microserviceUrl);
        return resultNode;
    }
}
