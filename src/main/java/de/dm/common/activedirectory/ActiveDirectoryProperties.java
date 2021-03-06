package de.dm.common.activedirectory;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "selavi.ad")
public class ActiveDirectoryProperties {

    private String url;
    private String userDn;
    private String password;
    private String base;
    private String domain;

}
