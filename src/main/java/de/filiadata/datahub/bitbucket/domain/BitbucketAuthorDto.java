package de.filiadata.datahub.bitbucket.domain;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class BitbucketAuthorDto {

    private String name;
    private String emailAddress;
    private Long id;
    private String displayName;
}
