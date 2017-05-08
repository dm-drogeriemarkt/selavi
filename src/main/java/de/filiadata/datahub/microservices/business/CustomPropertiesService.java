package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.microservices.business.semanticexceptions.PropertyAddException;
import de.filiadata.datahub.microservices.business.semanticexceptions.UnsupportedPropertyException;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.List;

@Service
public class CustomPropertiesService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomPropertiesService.class);
    private static final String MANDATORY_PROPERTY_ID = "id";
    private static final String MANDATORY_PROPERTY_LABEL = "label";
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;
    private BlacklistPropertyService blacklistPropertyService;

    @Autowired
    public CustomPropertiesService(ServicePropertiesRepository servicePropertiesRepository,
                                   DefaultNodeContentFactory defaultNodeContentFactory,
                                   BlacklistPropertyService blacklistPropertyService) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
        this.blacklistPropertyService = blacklistPropertyService;
    }

    public void addSingleValueProperties(String serviceName, ObjectNode property) {
        boolean isPersistedNode = servicePropertiesRepository.exists(serviceName);
        if (!isPersistedNode) {
            final ServiceProperties newServiceProperties = createNewServiceProperty(serviceName, property);
            servicePropertiesRepository.save(newServiceProperties);
        } else {
            final ServiceProperties updatedServiceProperties = updateExistingServiceProperty(serviceName, property);
            if (updatedServiceProperties == null) {
                throw new PropertyAddException();
            }

            servicePropertiesRepository.save(updatedServiceProperties);
        }
    }

    public void deleteProperty(String serviceName, List<String> propertyNames) {
        if (CollectionUtils.isEmpty(propertyNames)) {
            LOG.info("No properties to remove from.", serviceName);
            return;
        }

        final boolean serviceExists = servicePropertiesRepository.exists(serviceName);
        if (!serviceExists) {
            LOG.warn("There is no service '{}' to remove its properties", serviceName);
            return;
        }

        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        try {
            final ObjectNode content = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(serviceProperties.getContent());
            propertyNames.forEach(name -> {
                if (!MANDATORY_PROPERTY_ID.equals(name) && !MANDATORY_PROPERTY_LABEL.equals(name)) {
                    content.remove(name);
                }
            });

            serviceProperties.setContent(content.toString());
            servicePropertiesRepository.save(serviceProperties);

        } catch (IOException e) {
            LOG.error("Property could not be removed.", e);
        }
    }

    private ServiceProperties createNewServiceProperty(String serviceName, ObjectNode property) {
        final ObjectNode node = defaultNodeContentFactory.create(serviceName);
        addOrUpdateContentForServiceProperty(node, property);
        return new ServiceProperties(serviceName, node.toString());
    }

    private ServiceProperties updateExistingServiceProperty(String serviceName, ObjectNode property) {
        try {
            final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
            final ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(serviceProperties.getContent());

            addOrUpdateContentForServiceProperty(node, property);
            serviceProperties.setContent(node.toString());

            return serviceProperties;

        } catch (IOException e) {
            LOG.error("Update of service properties for service '{}' failed.", serviceName, e);
        }

        return null;
    }

    private void addOrUpdateContentForServiceProperty(ObjectNode node, ObjectNode property) {
        property.fieldNames().forEachRemaining(name -> {
            if (blacklistPropertyService.isBlacklistProperty(name)) {
                LOG.info("Property '{}' is a property from the registry and must not be overwritten.", name);
                throw new UnsupportedPropertyException();
            }

            node.set(name, property.get(name));
        });
    }
}
