package de.filiadata.datahub.microservices.business;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

@Data
@ConfigurationProperties(prefix = "selavi.registry")
public class ServiceRegistryProperties {

    private Map<String, String> url;
}
