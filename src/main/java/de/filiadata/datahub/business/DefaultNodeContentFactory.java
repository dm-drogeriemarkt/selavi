package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DefaultNodeContentFactory {
    private static final String KEY_ID = "id";
    private static final String KEY_LABEL = "label";

    private final ObjectMapper mapper;

    @Autowired
    public DefaultNodeContentFactory(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public ObjectNode create(String serviceName) {
        ObjectNode node = mapper.createObjectNode();
        node.put(KEY_ID, serviceName);
        node.put(KEY_LABEL, serviceName);

        return node;
    }

    public ObjectMapper getMapper() {
        return mapper;
    }
}
