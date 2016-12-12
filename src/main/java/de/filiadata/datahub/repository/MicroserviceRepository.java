package de.filiadata.datahub.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.DefaultNodeContentFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class MicroserviceRepository {

    // TODO: extract URL to config
    private static final String REGISTRY_URL = "http://example.com/eureka/apps";

    private RestTemplate restTemplate;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public MicroserviceRepository(RestTemplate restTemplate, DefaultNodeContentFactory defaultNodeContentFactory) {
        this.restTemplate = restTemplate;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public Map<String, ObjectNode> findAllServices() {
        final String nodeApplications = "applications";
        final ResponseEntity<ObjectNode> responseEntity = requestServices();
        final ObjectNode response = responseEntity.getBody();
        if (!response.hasNonNull(nodeApplications)) {
            return Collections.emptyMap();
        }

        final String nodeApplication = "application";
        final JsonNode rootNode = response.get(nodeApplications);
        if (!rootNode.hasNonNull(nodeApplication)) {
            return Collections.emptyMap();
        }

        final ArrayNode applicationsNode = (ArrayNode) rootNode.get(nodeApplication);
        return createResult(applicationsNode);
    }

    private Map<String, ObjectNode> createResult(ArrayNode applicationsNode) {
        final String nodeApplicationName = "name";
        final Map<String, ObjectNode> result = new HashMap<>();
        applicationsNode.forEach(application -> {
            String applicationName = application.get(nodeApplicationName).textValue();
            result.put(applicationName.toLowerCase(), defaultNodeContentFactory.create(applicationName));
        });
        return result;
    }

    private ResponseEntity<ObjectNode> requestServices() {
        final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));

        final HttpEntity<String> httpEntity = new HttpEntity<>("parameters", headers);
        return restTemplate.exchange(REGISTRY_URL, HttpMethod.GET, httpEntity, ObjectNode.class);
    }
}
