package de.filiadata.datahub.repository;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.DefaultNodeContentFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkDiscoverer;
import org.springframework.hateoas.hal.HalLinkDiscoverer;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service
public class MicroserviceRepository {

    // TODO: extract URL to config
    private static final String INTERNAL_GATEWAY_URL = "https://example.com/";
    private static final String IGNORE_NODE_NAME = "self";
    private static final String NODE_LINKS = "_links";
    private static final String KEY_MICROSERVICE_URL = "microservice-url";
    private RestTemplate restTemplate;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public MicroserviceRepository(RestTemplate restTemplate, DefaultNodeContentFactory defaultNodeContentFactory) {
        this.restTemplate = restTemplate;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    /**
     * Read all services from the internal microservice gateway and return a map with the service name and its url
     */
    public Map<String, ObjectNode> findAllServices() {
        final ObjectNode objectNode = restTemplate.getForObject(INTERNAL_GATEWAY_URL, ObjectNode.class);
        final Iterator<String> fieldNames = objectNode.get(NODE_LINKS).fieldNames();

        final LinkDiscoverer linkDiscoverer = new HalLinkDiscoverer();
        final Map<String, ObjectNode> result = new HashMap<>();
        fieldNames.forEachRemaining(name -> {
            if (!IGNORE_NODE_NAME.equals(name)) {
                final Link link = linkDiscoverer.findLinkWithRel(name, objectNode.toString());
                final ObjectNode resultNode = createResultNode(name, link.getHref());
                result.put(name, resultNode);
            }
        });

        return result;
    }

    private ObjectNode createResultNode(String name, String microserviceUrl) {
        final ObjectNode node = defaultNodeContentFactory.create(name);
        node.put(KEY_MICROSERVICE_URL, microserviceUrl);
        return node;
    }
}
