package de.filiadata.datahub.business.bitbucket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BitbucketAuthorDto {
    private String name;
    private String emailAddress;
    private Long id;
    private String displayName;
}
