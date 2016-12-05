package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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

    private static final Logger LOG = LoggerFactory.getLogger(ServiceConsumerRelationService.class);
    private MicroserviceRepository microserviceRepository;
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public ServicePropertiesService(MicroserviceRepository microserviceRepository,
                                    ServicePropertiesRepository servicePropertiesRepository,
                                    DefaultNodeContentFactory defaultNodeContentFactory) {
        this.microserviceRepository = microserviceRepository;
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> servicesFromGateway = microserviceRepository.findAllServices();
        appendPersistedServices(servicesFromGateway);

        return servicesFromGateway.values();
    }

    private void appendPersistedServices(Map<String, ObjectNode> servicesFromGateway) {
        final Iterable<ServiceProperties> allAdditionalServicesWithProperties = servicePropertiesRepository.findAll();
        final ObjectMapper mapper = new ObjectMapper();

        allAdditionalServicesWithProperties.forEach(info -> {
            try {
                ObjectNode node = (ObjectNode) mapper.readTree(info.getContent());
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
        servicePropertiesRepository.save(new ServiceProperties(serviceName, dto.toString()));
    }

    public void addRelation(String serviceName, String relatedServiceName) {
        ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        ObjectMapper mapper = defaultNodeContentFactory.getMapper();
        if (serviceProperties == null) {
            ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
            ArrayNode arrayNode = mapper.createArrayNode();
            arrayNode.add(relatedServiceName);
            contentNode.put("consumes", arrayNode);
            serviceProperties = new ServiceProperties(serviceName, contentNode.toString());
            servicePropertiesRepository.save(serviceProperties);
        } else {


            try {
                ObjectNode node = (ObjectNode) mapper.readTree(serviceProperties.getContent());
                boolean nodeExists = node.hasNonNull("consumes");
                if (nodeExists) {
                    ((ArrayNode) node.get("consumes")).add(relatedServiceName);
                }
                // TODO consumes erstellen wenn noch nicht da
                serviceProperties.setContent(node.toString());
                servicePropertiesRepository.save(serviceProperties);

            } catch (IOException e) {
                // TODO

            }
        }

    }
}
