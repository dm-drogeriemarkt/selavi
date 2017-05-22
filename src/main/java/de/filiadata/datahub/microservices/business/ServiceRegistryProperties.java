package de.filiadata.datahub.microservices.business;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.LinkedHashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "selavi.registry")
public class ServiceRegistryProperties {

    private Map<String, String> url = new LinkedHashMap<>();

    public Map<String, String> getUrl() {
        return url;
    }
}
