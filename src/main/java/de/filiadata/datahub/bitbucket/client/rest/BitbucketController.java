package de.filiadata.datahub.bitbucket.client.rest;

import de.filiadata.datahub.bitbucket.business.BitbucketService;
import de.filiadata.datahub.bitbucket.domain.TopCommitter;
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

    @GetMapping("/bitbucket/{microserviceId}")
    public List<TopCommitter> getBitbucketInformation(@PathVariable final String microserviceId) {
        return bitbucketService.getNamedTopCommitter(microserviceId);
    }

}
