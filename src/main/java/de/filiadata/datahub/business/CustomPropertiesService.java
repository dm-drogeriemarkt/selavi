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

    public void addSingleValueProperties(String serviceName, Map<String, String> properties) {
        boolean isPersistedNode = servicePropertiesRepository.exists(serviceName);
        if (!isPersistedNode) {
            final ServiceProperties newServiceProperties = createNewServiceProperty(serviceName, properties);
            servicePropertiesRepository.save(newServiceProperties);
        } else {
            final ServiceProperties updatedServiceProperties = updateExistingServiceProperty(serviceName, properties);
            if (updatedServiceProperties != null) {
                servicePropertiesRepository.save(updatedServiceProperties);
            }
        }
    }

    private ServiceProperties createNewServiceProperty(String serviceName, Map<String, String> properties) {
        final ObjectNode node = defaultNodeContentFactory.create(serviceName);
        addOrUpdateContentForServiceProperty(node, properties);
        return new ServiceProperties(serviceName, node.toString());
    }

    private ServiceProperties updateExistingServiceProperty(String serviceName, Map<String, String> properties) {
        try {
            final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
            final ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(serviceProperties.getContent());

            addOrUpdateContentForServiceProperty(node, properties);
            serviceProperties.setContent(node.toString());

            return serviceProperties;

        } catch (IOException e) {
            LOG.error("Update of service properties for service '{}' failed.", serviceName, e);
        }

        return null;
    }

    private void addOrUpdateContentForServiceProperty(ObjectNode node, Map<String, String> property) {
        property.forEach((key, value) -> {
            if (node.hasNonNull(key)) {
                node.set(key, JsonNodeFactory.instance.textNode(value));
            } else {
                node.put(key, value);
            }
        });
    }
}
