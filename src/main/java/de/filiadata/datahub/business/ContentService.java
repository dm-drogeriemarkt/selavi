package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceInfo;
import de.filiadata.datahub.repository.ServiceInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
public class ContentService {

    private MicroserviceReaderService microserviceReaderService;
    private ServiceInfoRepository serviceInfoRepository;

    @Autowired
    public ContentService(MicroserviceReaderService microserviceReaderService,
                          ServiceInfoRepository serviceInfoRepository) {
        this.microserviceReaderService = microserviceReaderService;
        this.serviceInfoRepository = serviceInfoRepository;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> allServices = microserviceReaderService.readServices();
        final List<ObjectNode> values = new ArrayList<>(allServices.values());
        appendPersistedServices(values);

        return values;
    }

    private void appendPersistedServices(List<ObjectNode> values) {
        final Iterable<ServiceInfo> allAdditionalServices = serviceInfoRepository.findAll();
        final ObjectMapper mapper = new ObjectMapper();
        allAdditionalServices.forEach(info -> {
            try {
                ObjectNode node = (ObjectNode) mapper.readTree(info.getContent());
                values.add(node);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void createNewServiceInfo(String serviceName, ObjectNode dto) {
        serviceInfoRepository.save(new ServiceInfo(serviceName, dto.toString()));
    }
}
