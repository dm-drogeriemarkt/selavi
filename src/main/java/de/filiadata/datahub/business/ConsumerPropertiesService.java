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
public class ConsumerPropertiesService {

    private static final String CONSUMER_NODE_NAME = "consumes";

    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public ConsumerPropertiesService(ServicePropertiesRepository servicePropertiesRepository,
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

        final ArrayNode newConsumerNode = createConsumerNode(relatedServiceName);
        existingNode.set(CONSUMER_NODE_NAME, newConsumerNode);
        serviceProperties.setContent(existingNode.toString());
        return servicePropertiesRepository.save(serviceProperties);
    }

    public ServiceProperties createAndSaveNewProperties(String serviceName, String relatedServiceName) {
        final ArrayNode consumerNode = createConsumerNode(relatedServiceName);
        final ObjectNode contentNode = defaultNodeContentFactory.create(serviceName);
        contentNode.set(CONSUMER_NODE_NAME, consumerNode);

        final ServiceProperties newServiceProperties = new ServiceProperties(serviceName, contentNode.toString());
        return servicePropertiesRepository.save(newServiceProperties);
    }

    private ArrayNode createConsumerNode(String relatedServiceName) {
        ArrayNode consumerNode = defaultNodeContentFactory.getMapper().createArrayNode();
        consumerNode.add(relatedServiceName);
        return consumerNode;
    }
}
