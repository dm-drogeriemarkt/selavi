package de.dm.microservices.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class MicroserviceDto {
    private String id;
    private String label;
    private List<HostDto> hosts = new ArrayList<>();
    private List<ConsumeDto> consumes = new ArrayList<>();
    private String description;
    private String bitbucketUrl;
    private String ignoredCommitters;
    private String fdOwner;
    private String tags;
    private String microserviceUrl;
    private String ipAddress;
    private String networkZone;
    private String documentationLink;
    private String buildMonitorLink;
    private String monitoringLink;
    private boolean external;

}
