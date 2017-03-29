package de.filiadata.datahub.controller;

import de.filiadata.datahub.business.AdditionalInformationService;
import de.filiadata.datahub.business.bitbucket.TopCommitter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/additional-information")
public class AdditionalInformationController {

    private final AdditionalInformationService additionalInformationService;

    public AdditionalInformationController(AdditionalInformationService additionalInformationService) {
        this.additionalInformationService = additionalInformationService;
    }

    @GetMapping("/bitbucket/{microserviceId}")
    public List<TopCommitter> getBitbucketInformation(@PathVariable final String microserviceId) {
        return additionalInformationService.getNamedTopCommitter(microserviceId);
    }

}
