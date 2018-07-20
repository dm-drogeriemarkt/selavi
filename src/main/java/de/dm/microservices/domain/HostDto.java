package de.dm.microservices.domain;

import lombok.AllArgsConstructor;
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
public class HostDto {

    private String hostName;
    private String ipAddr;
    private String homePageUrl;
    private List<Integer> ports = new ArrayList<>();
    private HealthStatus status;

}
