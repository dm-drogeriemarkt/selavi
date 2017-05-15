package de.filiadata.datahub.microservices.domain;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ConsumeDto {
    private String target;
    private String type;
    private String label;
}
