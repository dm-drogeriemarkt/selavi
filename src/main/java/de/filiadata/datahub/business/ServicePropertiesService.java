package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Service
public class ServicePropertiesService {

    private static final Logger LOG = LoggerFactory.getLogger(ServicePropertiesService.class);

    private ServicePropertiesRepository servicePropertiesRepository;
    private ConsumerPropertiesService consumerPropertiesService;
    private CustomPropertiesService customPropertiesService;
    private ServiceAddDeleteService serviceAddDeleteService;
    private PropertiesContentProviderService propertiesContentProviderService;

    @Autowired
    public ServicePropertiesService(PropertiesContentProviderService propertiesContentProviderService,
                                    ServicePropertiesRepository servicePropertiesRepository,
                                    ConsumerPropertiesService consumerPropertiesService,
                                    CustomPropertiesService customPropertiesService,
                                    ServiceAddDeleteService serviceAddDeleteService) {
        this.propertiesContentProviderService = propertiesContentProviderService;
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.consumerPropertiesService = consumerPropertiesService;
        this.customPropertiesService = customPropertiesService;
        this.serviceAddDeleteService = serviceAddDeleteService;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        return propertiesContentProviderService.getAllServicesWithContent().values();
    }


    public void createNewServiceInfo(ObjectNode dto) {
        serviceAddDeleteService.createNewServiceInfo(dto);
    }

    public void addRelation(String serviceName, ObjectNode relationProperties) {
        final Boolean servicePropertiesExist = servicePropertiesRepository.exists(serviceName);
        if (!servicePropertiesExist) {
            consumerPropertiesService.createAndSaveNewProperties(serviceName, relationProperties);
        } else {
            try {
                consumerPropertiesService.addConsumedService(serviceName, relationProperties);
            } catch (IOException e) {
                LOG.warn("Update of service properties failed.", e);
            }
        }
    }

    public void deleteRelation(String serviceName, String relatedServiceName) {
        consumerPropertiesService.removeRelation(serviceName, relatedServiceName);
    }

    public void addProperties(String serviceName, ObjectNode property) {
        customPropertiesService.addSingleValueProperties(serviceName, property);
    }

    public void deleteProperty(String serviceName, String propertyName) {
        customPropertiesService.deleteProperty(serviceName, Collections.singletonList(propertyName));
    }

    public void deleteService(String serviceName) {
        serviceAddDeleteService.deleteService(serviceName);
    }
}
