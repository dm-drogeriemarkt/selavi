package de.filiadata.datahub.business;


import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class PersistedPropertiesContentProvider implements PropertiesContentProvider {

    private static final Logger LOG = LoggerFactory.getLogger(PersistedPropertiesContentProvider.class);
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public PersistedPropertiesContentProvider(ServicePropertiesRepository servicePropertiesRepository,
                                              DefaultNodeContentFactory defaultNodeContentFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public Map<String, ObjectNode> getContent() {
        final Map<String, ObjectNode> result = new HashMap<>();
        final Iterable<ServiceProperties> allServiceProperties = servicePropertiesRepository.findAll();
        allServiceProperties.forEach(properties -> {
            try {
                ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(properties.getContent());
                result.put(properties.getId(), node);
            } catch (IOException e) {
                LOG.error("Service properties with ID '{}' is corrupted and will be skipped.", properties.getId(), e);
            }
        });
        return result;
    }
}
