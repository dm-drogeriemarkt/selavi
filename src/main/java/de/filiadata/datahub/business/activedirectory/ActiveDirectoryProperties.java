package de.filiadata.datahub.business.activedirectory;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "selavi.ad")
public class ActiveDirectoryProperties {

    private String url;
    private String password;
}
