package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class CustomPropertiesService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomPropertiesService.class);
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public CustomPropertiesService(ServicePropertiesRepository servicePropertiesRepository,
                                   DefaultNodeContentFactory defaultNodeContentFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public void addSingleValueProperties(String serviceName, Map<String, String> property) {
        boolean isPersistedNode = servicePropertiesRepository.exists(serviceName);
        if (!isPersistedNode) {
            servicePropertiesRepository.save(persistNewEntry(serviceName, property));
        } else {
            final ServiceProperties serviceProperties = setPropertyForPersistedEntry(serviceName, property);
            if (serviceProperties != null) {
                servicePropertiesRepository.save(serviceProperties);
            }
        }
    }

    private ServiceProperties persistNewEntry(String serviceName, Map<String, String> property) {
        final ObjectNode node = defaultNodeContentFactory.create(serviceName);
        addOrUpdatePropertyToNode(node, property);
        return new ServiceProperties(serviceName, node.toString());
    }

    private ServiceProperties setPropertyForPersistedEntry(String serviceName, Map<String, String> property) {
        try {
            final ServiceProperties properties = servicePropertiesRepository.findById(serviceName);
            final ObjectNode node;
            node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(properties.getContent());
            addOrUpdatePropertyToNode(node, property);
            properties.setContent(node.toString());
            return properties;

        } catch (IOException e) {
            LOG.info("Update of service property for service '{}' failed.", serviceName, e);
        }
        return null;
    }

    private void addOrUpdatePropertyToNode(ObjectNode node, Map<String, String> property) {
        property.forEach((k, v) -> {
            if (node.hasNonNull(k)) {
                node.set(k, JsonNodeFactory.instance.textNode(v));
            } else {
                node.put(k, v);
            }
        });
    }
}
