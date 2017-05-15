package de.filiadata.datahub.microservices.domain;

import lombok.*;

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


}
