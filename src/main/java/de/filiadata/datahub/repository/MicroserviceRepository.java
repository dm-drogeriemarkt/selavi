package de.filiadata.datahub.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.DefaultNodeContentFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class MicroserviceRepository {

    private static final String KEY_MICROSERVICE_URL = "microservice-url";
    private RestTemplate restTemplate;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public MicroserviceRepository(RestTemplate restTemplate,
                                  DefaultNodeContentFactory defaultNodeContentFactory) {
        this.restTemplate = restTemplate;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    /**
     * Read all services from the internal microservice gateway and return a map with the service name and its url
     */
    public Map<String, ObjectNode> findAllServices() {
        // TODO: extract URL to config
        final ObjectNode objectNode = restTemplate.getForObject("https://example.com/", ObjectNode.class);
        final JsonNode jsonNode = objectNode.get("_links");
        final Iterator<String> fieldNames = jsonNode.fieldNames();

        final Map<String, ObjectNode> result = new HashMap<>();
        fieldNames.forEachRemaining(name -> {
            final JsonNode nodeValue = jsonNode.get(name);
            final String microserviceUrl = nodeValue.get("href").toString();
            final ObjectNode resultNode = createResultNode(name, microserviceUrl);
            result.put(name, resultNode);
        });

        return result;
    }

    private ObjectNode createResultNode(String name, String microserviceUrl) {
        final ObjectNode node = defaultNodeContentFactory.create(name);
        node.put(KEY_MICROSERVICE_URL, microserviceUrl);
        return node;
    }
}
