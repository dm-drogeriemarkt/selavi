package de.filiadata.datahub.selavi.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.selavi.repository.MicroserviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GatewayPropertiesContentProvider implements PropertiesContentProvider {

    private MicroserviceRepository microserviceRepository;

    @Autowired
    public GatewayPropertiesContentProvider(MicroserviceRepository microserviceRepository) {
        this.microserviceRepository = microserviceRepository;
    }

    public Map<String, ObjectNode> getContent() {
        return microserviceRepository.findAllServices();
    }
}
