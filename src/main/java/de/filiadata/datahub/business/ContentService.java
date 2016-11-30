package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.controller.ContentDto;
import de.filiadata.datahub.repository.ServiceInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Service
public class ContentService {


    private MicroserviceReaderService microserviceReaderService;
    private ServiceInfoRepository serviceInfoRepository;

    @Autowired
    public ContentService(MicroserviceReaderService microserviceReaderService, ServiceInfoRepository serviceInfoRepository) {
        this.microserviceReaderService = microserviceReaderService;
        this.serviceInfoRepository = serviceInfoRepository;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> allServices = microserviceReaderService.readServices();
        return allServices.values();
    }

    private void getConent(String serviceName, ObjectNode content) {
        // TODO: search for content by serviceName, and expand content with additional content from db
    }

    public void saveContent(String serviceName, ContentDto dto) {
        // TODO
    }

    public void updateContent(String serviceName, ContentDto dto) {
        // TODO
    }
}
