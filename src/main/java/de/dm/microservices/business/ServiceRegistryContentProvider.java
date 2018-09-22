package de.dm.microservices.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.dm.microservices.domain.MicroserviceDto;
import de.dm.microservices.repository.ServiceRegistryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class ServiceRegistryContentProvider {

    private static final String APPLICATION = "application";
    private static final String NAME = "name";
    private static final String HOSTS = "hosts";
    private static final String BITBUCKET_URL = "bitbucketUrl";
    private static final String IGNORED_COMMITTERS = "ignoredCommitters";
    private static final String DESCRIPTION = "description";
    private static final String METADATA = "metadata";
    private static final String INSTANCE = "instance";
    private static final String HOST_NAME = "hostName";
    private static final String IP_ADDR = "ipAddr";
    private static final String HOME_PAGE_URL = "homePageUrl";
    private static final String PORT = "port";
    private static final String SECURE_PORT = "securePort";
    private static final String PORTS = "ports";
    private static final String CONSUMES = "consumes";
    private static final String TARGET = "target";
    private static final String TYPE = "type";
    private static final String AT_ENABLED = "@enabled";
    public static final String HEALTH_STATUS = "status";

    private final DefaultNodeContentFactory defaultNodeContentFactory;
    private final ServiceRegistryRepository serviceRegistryRepository;
    private final MicroserviceDtoFactory microserviceDtoFactory;
    private final ObjectMapper mapper;

    public ServiceRegistryContentProvider(DefaultNodeContentFactory defaultNodeContentFactory,
                                          ServiceRegistryRepository serviceRegistryRepository,
                                          MicroserviceDtoFactory microserviceDtoFactory, ObjectMapper mapper) {
        this.defaultNodeContentFactory = defaultNodeContentFactory;
        this.serviceRegistryRepository = serviceRegistryRepository;
        this.microserviceDtoFactory = microserviceDtoFactory;
        this.mapper = mapper;
    }

    public Set<String> getAllStageNames() {
        return serviceRegistryRepository.getAllStageNames();
    }

    public Map<String, MicroserviceDto> getAllMicroservices(String stage) {

        final String nodeApplications = "applications";

        ResponseEntity<ObjectNode> responseEntity = serviceRegistryRepository.findAllServices(stage);

        final ObjectNode response = responseEntity.getBody();
        if (!response.hasNonNull(nodeApplications)) {
            return Collections.emptyMap();
        }

        final JsonNode rootNode = response.get(nodeApplications);
        if (!rootNode.hasNonNull(APPLICATION)) {
            return Collections.emptyMap();
        }

        final ArrayNode applicationsNode = (ArrayNode) rootNode.get(APPLICATION);
        return createResult(applicationsNode);
    }

    private Map<String, MicroserviceDto> createResult(ArrayNode applicationsNode) {

        final Map<String, MicroserviceDto> microserviceDtoMap = new HashMap<>();
        applicationsNode.forEach(application -> {
            final String applicationName = application.get(NAME).textValue();
            final ObjectNode applicationNode = defaultNodeContentFactory.create(applicationName);
            applicationNode.set(HOSTS, readHostInfos(application));
            applicationNode.set(CONSUMES, readConsumers(application));
            addMetadataPropertiesToBaseNode(applicationNode, application);
            microserviceDtoMap.put(applicationName, microserviceDtoFactory.getMicroserviceDtoFromJSON(applicationNode.toString()));
        });
        return microserviceDtoMap;
    }

    private void addMetadataPropertiesToBaseNode(ObjectNode applicationNode, JsonNode application) {

        final ArrayNode instances = (ArrayNode) application.get(INSTANCE);
        final JsonNode metadata = instances.get(0).get(METADATA);

        addChildNodeToBaseNode(applicationNode, metadata, DESCRIPTION);
        addChildNodeToBaseNode(applicationNode, metadata, BITBUCKET_URL);
        addChildNodeToBaseNode(applicationNode, metadata, IGNORED_COMMITTERS);
        addChildNodeToBaseNode(applicationNode, metadata, "fdOwner");
        addChildNodeToBaseNode(applicationNode, metadata, "tags");
        addChildNodeToBaseNode(applicationNode, metadata, "description");
        addChildNodeToBaseNode(applicationNode, metadata, "microserviceUrl");
        addChildNodeToBaseNode(applicationNode, metadata, "ipAddress");
        addChildNodeToBaseNode(applicationNode, metadata, "networkZone");
        addChildNodeToBaseNode(applicationNode, metadata, "documentationLink");
        addChildNodeToBaseNode(applicationNode, metadata, "buildMonitorLink");
        addChildNodeToBaseNode(applicationNode, metadata, "monitoringLink");
        addChildNodeToBaseNode(applicationNode, metadata, "version");
    }

    private void addChildNodeToBaseNode(ObjectNode applicationNode, JsonNode metadata, String fieldName) {

        if (metadata.get(fieldName) != null) {
            applicationNode.set(fieldName, metadata.get(fieldName));
        }
    }

    private ArrayNode readHostInfos(JsonNode applicationNode) {

        final ArrayNode result = JsonNodeFactory.instance.arrayNode();
        final ArrayNode instances = (ArrayNode) applicationNode.get(INSTANCE);

        instances.forEach(instanceNode -> {

            final ObjectNode hostResultNode = mapper.createObjectNode();
            addSingleProperty(hostResultNode, instanceNode, HOST_NAME);
            addSingleProperty(hostResultNode, instanceNode, IP_ADDR);
            addSingleProperty(hostResultNode, instanceNode, HOME_PAGE_URL);
            addSingleProperty(hostResultNode, instanceNode, HEALTH_STATUS);

            final ArrayNode portNodes = JsonNodeFactory.instance.arrayNode();
            addArrayProperty(portNodes, instanceNode, PORT);
            addArrayProperty(portNodes, instanceNode, SECURE_PORT);

            hostResultNode.set(PORTS, portNodes);
            result.add(hostResultNode);
        });

        return result;
    }

    private ArrayNode readConsumers(JsonNode applicationNode) {

        final ArrayNode result = JsonNodeFactory.instance.arrayNode();
        final ArrayNode instances = (ArrayNode) applicationNode.get(INSTANCE);
        final JsonNode metadata = instances.get(0).get(METADATA);

        if (metadata.get(CONSUMES) != null) {

            String consumersInput = metadata.get(CONSUMES).asText();
            String[] consumersWithCommunicationType = consumersInput.split(",");

            for (String consumerWithType : consumersWithCommunicationType) {
                ObjectNode consumerObjectNode = JsonNodeFactory.instance.objectNode();

                String[] consumer = consumerWithType.split(":");
                int consumerLength = consumer.length;

                if (consumerLength >= 1) {
                    consumerObjectNode.put(TARGET, consumer[0].toUpperCase());

                    if (consumerLength == 2) {
                        consumerObjectNode.put(TYPE, consumer[1]);
                    }
                    result.add(consumerObjectNode);
                }
            }
        }
        return result;
    }


    private void addArrayProperty(ArrayNode portsNode, JsonNode instanceNode, String propertyName) {

        if (instanceNode.hasNonNull(propertyName)) {

            final JsonNode port = instanceNode.get(propertyName);
            if ("true".equals(port.get(AT_ENABLED).textValue())) {
                portsNode.add(JsonNodeFactory.instance.numberNode(port.get("$").intValue()));
            }
        }
    }

    private void addSingleProperty(ObjectNode hostNode, JsonNode instanceNode, String propertyName) {

        if (instanceNode.hasNonNull(propertyName)) {
            hostNode.set(propertyName, JsonNodeFactory.instance.textNode(instanceNode.get(propertyName).asText()));
        }
    }
}
