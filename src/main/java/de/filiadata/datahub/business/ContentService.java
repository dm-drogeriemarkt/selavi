package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ConsumerRelation;
import de.filiadata.datahub.domain.ServiceInfo;
import de.filiadata.datahub.repository.ConsumerRelationRepository;
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
    private ConsumerRelationRepository consumerRelationRepository;

    @Autowired
    public ContentService(MicroserviceReaderService microserviceReaderService,
                          ServiceInfoRepository serviceInfoRepository,
                          ConsumerRelationRepository consumerRelationRepository) {
        this.microserviceReaderService = microserviceReaderService;
        this.serviceInfoRepository = serviceInfoRepository;
        this.consumerRelationRepository = consumerRelationRepository;
    }

    public Collection<ObjectNode> getServicesWithContent() {
        final Map<String, ObjectNode> allServices = microserviceReaderService.readServices();
        final List<ObjectNode> values = new ArrayList<>(allServices.values());

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


        return values;
    }

    private void getConent(String serviceName, ObjectNode content) {
        // TODO: search for content by serviceName, and expand content with additional content from db
    }

    public void createNewServiceInfo(String serviceName, ObjectNode dto) {
        serviceInfoRepository.save(new ServiceInfo(serviceName, dto.toString()));
    }

    public void createNewConsumerRelation(String consumedServiceId, String serviceName) {
        final ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("id", consumedServiceId);
        objectNode.put("label", consumedServiceId);

        final ArrayNode arrayNode = objectMapper.createArrayNode();
        arrayNode.add(serviceName);
        objectNode.put("consumes", arrayNode);

        final ConsumerRelation consumerRelation = new ConsumerRelation(consumedServiceId, objectNode.toString());
        consumerRelationRepository.save(consumerRelation);
    }
}
