package de.filiadata.datahub.bitbucket.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BitbucketCommitsDto {
    private Integer size;
    private boolean lastPage;
    private Integer start;
    private Integer limit;
    private Integer nextPageStart;
    private List<BitbucketCommitterDto> values = new ArrayList<>();


}
