package de.dm.bitbucket.client.rest;

import de.dm.bitbucket.business.BitbucketService;
import de.dm.bitbucket.domain.TopCommitterDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BitbucketController {

    private final BitbucketService bitbucketService;

    public BitbucketController(BitbucketService bitbucketService) {
        this.bitbucketService = bitbucketService;
    }

    @GetMapping("/bitbucket/{stage}/{microserviceId}")
    public List<TopCommitterDto> getBitbucketInformation(@PathVariable final String stage, @PathVariable final String microserviceId) {
        return bitbucketService.getNamedTopCommitter(stage, microserviceId);
    }

}
