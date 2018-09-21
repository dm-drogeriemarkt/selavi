package de.dm.frontendconfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;

@RestController
public class FrontendConfigRestController {

    @Value("${selavi.frontend.documentationUrl}")
    private String documentationUrl;

    @GetMapping("/frontendconfig")
    @PermitAll
    public FrontendConfigDto frontendConfig() {
        return FrontendConfigDto.builder().documentationUrl(documentationUrl).build();
    }
}
