package de.filiadata.datahub.microservices.business;

import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.LinkedHashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "selavi.registry")
public class ServiceRegistryProperties {

    @Getter
    private Map<String, String> url = new LinkedHashMap<>();
}
