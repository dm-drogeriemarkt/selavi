package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.MicroserviceRepository;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;

@Service
public class ServicePropertiesService {

    private static final Logger LOG = LoggerFactory.getLogger(ServicePropertiesService.class);

    private MicroserviceRepository microserviceRepository;
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;
    private ServicePropertiesHandlerService servicePropertiesHandlerService;
    private CustomPropertiesService customPropertiesService;

    @Autowired
    public ServicePropertiesService(MicroserviceRepository microserviceRepository,
                                    ServicePropertiesRepository servicePropertiesRepository,
                                    DefaultNodeContentFactory defaultNodeContentFactory,
                                    ServicePropertiesHandlerService servicePropertiesHandlerService,
                                    CustomPropertiesService customPropertiesService) {
        this.microserviceRepository = microserviceRepository;
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
        this.servicePropertiesHandlerService = servicePropertiesHandlerService;
        this.customPropertiesService = customPropertiesService;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> servicesFromGateway = microserviceRepository.findAllServices();
        appendPersistedServices(servicesFromGateway);

        return servicesFromGateway.values();
    }

    private void appendPersistedServices(Map<String, ObjectNode> servicesFromGateway) {
        final Iterable<ServiceProperties> allAdditionalServicesWithProperties = servicePropertiesRepository.findAll();
        allAdditionalServicesWithProperties.forEach(info -> {
            try {
                ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(info.getContent());
                if (servicesFromGateway.containsKey(info.getId())) {
                    ObjectNode existingNode = servicesFromGateway.get(info.getId());
                    existingNode.setAll(node);
                } else {
                    servicesFromGateway.put(info.getId(), node);
                }
            } catch (IOException e) {
                LOG.info("Service properties with ID '{}' is corrupted and will be skipped.", info.getId(), e);
            }
        });
    }

    public void createNewServiceInfo(String serviceName, ObjectNode dto) {
        if (!servicePropertiesRepository.exists(serviceName)) {
            servicePropertiesRepository.save(new ServiceProperties(serviceName, dto.toString()));
        }
    }

    public void addRelation(String serviceName, String relatedServiceName) {
        final Boolean servicePropertiesExist = servicePropertiesRepository.exists(serviceName);
        if (!servicePropertiesExist) {
            servicePropertiesHandlerService.createAndSaveNewProperties(serviceName, relatedServiceName);
        } else {
            try {
                servicePropertiesHandlerService.updateExistingProperties(serviceName, relatedServiceName);
            } catch (IOException e) {
                LOG.info("Update of service properties failed.", e);
            }
        }
    }

    public void addProperties(String serviceName, Map<String, String> property) {
        customPropertiesService.addSingleValueProperties(serviceName, property);
    }
}
