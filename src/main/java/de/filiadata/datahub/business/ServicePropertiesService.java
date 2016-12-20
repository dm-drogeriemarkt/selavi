package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Service
public class ServicePropertiesService {

    private static final Logger LOG = LoggerFactory.getLogger(ServicePropertiesService.class);

    private ServicePropertiesRepository servicePropertiesRepository;
    private ConsumerPropertiesService consumerPropertiesService;
    private CustomPropertiesService customPropertiesService;
    private PropertiesContentProviderService propertiesContentProviderService;

    @Autowired
    public ServicePropertiesService(PropertiesContentProviderService propertiesContentProviderService,
                                    ServicePropertiesRepository servicePropertiesRepository,
                                    ConsumerPropertiesService consumerPropertiesService,
                                    CustomPropertiesService customPropertiesService) {
        this.propertiesContentProviderService = propertiesContentProviderService;
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.consumerPropertiesService = consumerPropertiesService;
        this.customPropertiesService = customPropertiesService;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        return propertiesContentProviderService.getAllServicesWithContent().values();
    }


    public void createNewServiceInfo(ObjectNode dto) {
        String serviceName = dto.get("id").textValue();
        if (!servicePropertiesRepository.exists(serviceName)) {
            servicePropertiesRepository.save(new ServiceProperties(serviceName, dto.toString()));
        }
    }

    public void addRelation(String serviceName, String relatedServiceName) {
        final Boolean servicePropertiesExist = servicePropertiesRepository.exists(serviceName);
        if (!servicePropertiesExist) {
            consumerPropertiesService.createAndSaveNewProperties(serviceName, relatedServiceName);
        } else {
            try {
                consumerPropertiesService.addConsumedService(serviceName, relatedServiceName);
            } catch (IOException e) {
                LOG.warn("Update of service properties failed.", e);
            }
        }
    }

    public void deleteRelation(String serviceName, String relatedServiceName) {
        consumerPropertiesService.removeRelation(serviceName, relatedServiceName);
    }

    public void addProperties(String serviceName, Map<String, String> property) {
        customPropertiesService.addSingleValueProperties(serviceName, property);
    }

    public void deleteProperty(String serviceName, String propertyName) {
        customPropertiesService.deleteProperty(serviceName, Collections.singletonList(propertyName));
    }
}
