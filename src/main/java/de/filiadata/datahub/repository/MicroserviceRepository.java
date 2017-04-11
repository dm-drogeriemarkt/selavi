package de.filiadata.datahub.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import de.filiadata.datahub.business.DefaultNodeContentFactory;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class MicroserviceRepository {

    private static final Logger LOG = LoggerFactory.getLogger(MicroserviceRepository.class);

    private static final String NAME = "name";
    private static final String HOSTS = "hosts";
    private static final String METADATA = "metadata";
    private static final String INSTANCE = "instance";
    private static final String HOST_NAME = "hostName";
    private static final String IP_ADDR = "ipAddr";
    private static final String HOME_PAGE_URL = "homePageUrl";
    private static final String PORT = "port";
    private static final String SECURE_PORT = "securePort";
    private static final String PORTS = "ports";
    private static final String DESCRIPTION = "description";
    private static final String CONSUMERS = "consumers";
    private static final String IGNORED_COMMITTERS = "ignoredCommitters";

    private RestTemplate restTemplate;
    private DefaultNodeContentFactory defaultNodeContentFactory;
    private Boolean offlineMode;
    private String registryUrl;

    @Autowired
    public MicroserviceRepository(RestTemplate restTemplate,
                                  DefaultNodeContentFactory defaultNodeContentFactory,
                                  @Value("${development.offline-mode:false}") String offlineMode,
                                  @Value("${registry.url}") String registryUrl) {
        this.restTemplate = restTemplate;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
        this.offlineMode = Boolean.parseBoolean(offlineMode);
        this.registryUrl = registryUrl;
    }


    @Cacheable("microservices")
    public Map<String, ObjectNode> findAllServices() {
        LOG.info("Load services from Registry ...");
        final String nodeApplications = "applications";

        if (offlineMode) {
            LOG.info("Dev mode: not fetching microservices from registry, returning empty map...");
            return Collections.emptyMap();
        }

        ResponseEntity<ObjectNode> responseEntity;
        try {
            responseEntity = requestServices();
        } catch (RestClientException ex) {
            LOG.warn("Error fetching microservices from registry, returning empty map...", ex);
            return Collections.emptyMap();
        }

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
        final Map<String, ObjectNode> result = new HashMap<>();
        applicationsNode.forEach(application -> {
            final String applicationName = application.get(NAME).textValue();
            final ObjectNode applicationNode = defaultNodeContentFactory.create(applicationName);
            applicationNode.set(HOSTS, readHostInfos(application));
            applicationNode.set(METADATA, readMetadata(application));
            result.put(applicationName, applicationNode);
        });
        return result;
    }

    private ArrayNode readHostInfos(JsonNode applicationNode) {
        final ArrayNode result = JsonNodeFactory.instance.arrayNode();
        final ArrayNode instances = (ArrayNode) applicationNode.get(INSTANCE);
        instances.forEach(instanceNode -> {
            final ObjectNode hostResultNode = defaultNodeContentFactory.getMapper().createObjectNode();
            addSingleProperty(hostResultNode, instanceNode, HOST_NAME);
            addSingleProperty(hostResultNode, instanceNode, IP_ADDR);
            addSingleProperty(hostResultNode, instanceNode, HOME_PAGE_URL);

            final ArrayNode portNodes = JsonNodeFactory.instance.arrayNode();
            addArrayProperty(portNodes, instanceNode, PORT);
            addArrayProperty(portNodes, instanceNode, SECURE_PORT);

            hostResultNode.set(PORTS, portNodes);
            result.add(hostResultNode);
        });

        return result;
    }

    private ArrayNode readMetadata(JsonNode applicationNode) {

        final ArrayNode result = JsonNodeFactory.instance.arrayNode();
        final ArrayNode instances = (ArrayNode) applicationNode.get(INSTANCE);

        final JsonNode metadata = instances.get(0).get(METADATA);
        final ObjectNode metaResultNode = defaultNodeContentFactory.getMapper().createObjectNode();

        addChildNodeToMetaResultNode(metaResultNode, metadata, DESCRIPTION);
        addChildNodeToMetaResultNode(metaResultNode, metadata, CONSUMERS);
        addChildNodeToMetaResultNode(metaResultNode, metadata, IGNORED_COMMITTERS);

        result.add(metaResultNode);
        return result;
    }

    private void addChildNodeToMetaResultNode(ObjectNode metaResultNode, JsonNode metadata, String fieldName) {
        if (metadata.get(fieldName) != null) {
            final ArrayNode childNode = JsonNodeFactory.instance.arrayNode();
            final TextNode child = JsonNodeFactory.instance.textNode(metadata.get(fieldName).asText());
            if (StringUtils.isNotEmpty(child.asText())) {
                childNode.add(child);
                metaResultNode.set(fieldName, childNode);
            }
        }
    }

    private void addArrayProperty(ArrayNode portsNode, JsonNode instanceNode, String propertyName) {
        if (instanceNode.hasNonNull(propertyName)) {
            final JsonNode port = instanceNode.get(propertyName);
            if ("true".equals(port.get("@enabled").textValue())) {
                portsNode.add(JsonNodeFactory.instance.numberNode(port.get("$").intValue()));
            }
        }
    }

    private void addSingleProperty(ObjectNode hostNode, JsonNode instanceNode, String propertyName) {
        if (instanceNode.hasNonNull(propertyName)) {
            hostNode.set(propertyName, JsonNodeFactory.instance.textNode(instanceNode.get(propertyName).asText()));
        }
    }

    private ResponseEntity<ObjectNode> requestServices() {
        final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));

        final HttpEntity<String> httpEntity = new HttpEntity<>("parameters", headers);
        return restTemplate.exchange(registryUrl, HttpMethod.GET, httpEntity, ObjectNode.class);
    }
}
