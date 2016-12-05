package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ServicePropertiesHandlerService {

    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    private static final String CONSUMER_NODE_NAME = "consumes";

    @Autowired
    public ServicePropertiesHandlerService(ServicePropertiesRepository servicePropertiesRepository,
                                           DefaultNodeContentFactory defaultNodeContentFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public ServiceProperties updateExistingProperties(String serviceName, String relatedServiceName) throws IOException {
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        final ObjectMapper mapper = defaultNodeContentFactory.getMapper();
        final ObjectNode existingNode = (ObjectNode) mapper.readTree(serviceProperties.getContent());

        boolean consumerNodeExists = existingNode.hasNonNull(CONSUMER_NODE_NAME);
        if (consumerNodeExists) {
            final ArrayNode existingConsumerNode = (ArrayNode) existingNode.get(CONSUMER_NODE_NAME);
            existingConsumerNode.add(relatedServiceName);
            serviceProperties.setContent(existingNode.toString());
            return servicePropertiesRepository.save(serviceProperties);
        }

        final ObjectNode newConsumerNode = createConsumerNode(serviceName, relatedServiceName);
        serviceProperties.setContent(newConsumerNode.toString());
        return servicePropertiesRepository.save(serviceProperties);
    }

    public ServiceProperties createAndSaveNewProperties(String serviceName, String relatedServiceName) {
        ObjectNode nodeWithConsumers = createConsumerNode(serviceName, relatedServiceName);
        ServiceProperties newServiceProperties = new ServiceProperties(serviceName, nodeWithConsumers.toString());
        return servicePropertiesRepository.save(newServiceProperties);
    }

    private ObjectNode createConsumerNode(String serviceName, String relatedServiceName) {
        ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
        ArrayNode consumerNode = defaultNodeContentFactory.getMapper().createArrayNode();
        consumerNode.add(relatedServiceName);
        contentNode.set(CONSUMER_NODE_NAME, consumerNode);

        return contentNode;
    }
}
