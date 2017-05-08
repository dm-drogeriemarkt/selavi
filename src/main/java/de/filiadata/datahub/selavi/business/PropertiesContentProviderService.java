package de.filiadata.datahub.selavi.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PropertiesContentProviderService {

    private List<PropertiesContentProvider> allPropertiesWithContent;

    @Autowired
    public PropertiesContentProviderService(List<PropertiesContentProvider> allPropertiesWithContent) {
        this.allPropertiesWithContent = allPropertiesWithContent;
    }

    public Map<String, ObjectNode> getAllServicesWithContent() {
        final Map<String, ObjectNode> result = new HashMap<>();
        allPropertiesWithContent.forEach(provider -> {
            final Map<String, ObjectNode> content = provider.getContent();
            mergeContent(result, content);
        });
        return result;
    }

    private void mergeContent(Map<String, ObjectNode> result, Map<String, ObjectNode> content) {
        content.forEach((key, value) -> {
            if (!result.containsKey(key)) {
                result.put(key, value);
            } else {
                result.get(key).setAll(value);
            }
        });
    }
}
