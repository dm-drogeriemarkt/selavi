package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.MicroserviceRepository;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
public class ServicePropertiesService {

    private MicroserviceRepository microserviceRepository;
    private ServicePropertiesRepository servicePropertiesRepository;

    @Autowired
    public ServicePropertiesService(MicroserviceRepository microserviceRepository,
                                    ServicePropertiesRepository servicePropertiesRepository) {
        this.microserviceRepository = microserviceRepository;
        this.servicePropertiesRepository = servicePropertiesRepository;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> allServices = microserviceRepository.findAllServices();
        final List<ObjectNode> values = new ArrayList<>(allServices.values());
        appendPersistedServices(values);

        return values;
    }

    private void appendPersistedServices(List<ObjectNode> values) {
        final Iterable<ServiceProperties> allAdditionalServicesWithProperties = servicePropertiesRepository.findAll();
        final ObjectMapper mapper = new ObjectMapper();

        allAdditionalServicesWithProperties.forEach(info -> {
            try {
                ObjectNode node = (ObjectNode) mapper.readTree(info.getContent());
                values.add(node);
            } catch (IOException e) {
                // TODO: Logging
            }
        });
    }

    public void createNewServiceInfo(String serviceName, ObjectNode dto) {
        servicePropertiesRepository.save(new ServiceProperties(serviceName, dto.toString()));
    }
}
