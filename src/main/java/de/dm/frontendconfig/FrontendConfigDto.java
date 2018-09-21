package de.dm.frontendconfig;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FrontendConfigDto {
    private String documentationUrl;
}
