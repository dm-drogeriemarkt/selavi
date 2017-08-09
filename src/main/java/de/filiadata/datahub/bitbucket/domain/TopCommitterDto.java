package de.filiadata.datahub.bitbucket.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopCommitterDto {

    private Long id;
    private String name;
    private String emailAddress;
    private Long numberOfCommits;

}
