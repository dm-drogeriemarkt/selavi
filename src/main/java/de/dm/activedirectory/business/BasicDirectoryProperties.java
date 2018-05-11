package de.dm.activedirectory.business;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "selavi.ad")
public class BasicDirectoryProperties {

    private String url;
    private String base;
}
