package de.filiadata.datahub.controller;

import de.filiadata.datahub.business.AdditionalInformationService;
import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/additional-information")
public class AdditionalInformationController {

    private final AdditionalInformationService additionalInformationService;

    public AdditionalInformationController(AdditionalInformationService additionalInformationService) {
        this.additionalInformationService = additionalInformationService;
    }

    @GetMapping("/bitbucket/{microserviceId}")
    public Map<BitbucketAuthorDto, Long> getBitbucketInformation(@PathVariable final String microserviceId) {
        return additionalInformationService.getTopCommitters(microserviceId);
    }

}
