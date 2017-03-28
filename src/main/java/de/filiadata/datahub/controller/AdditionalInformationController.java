package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/additional-information")
public class AdditionalInformationController {

    private final BitbucketService bitbucketService;
    private final ServicePropertiesRepository servicePropertiesRepository;

    public AdditionalInformationController(BitbucketService bitbucketService, ServicePropertiesRepository servicePropertiesRepository) {
        this.bitbucketService = bitbucketService;
        this.servicePropertiesRepository = servicePropertiesRepository;
    }

    @GetMapping("/bitbucket/{microserviceId}")
    public Map<BitbucketAuthorDto, Long> getBitbucketInformation(@PathVariable final String microserviceId) throws IOException {
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(microserviceId);
        final String content = serviceProperties.getContent();
        final ObjectMapper objectMapper = new ObjectMapper();

        final ObjectNode objectNode = objectMapper.readValue(content, ObjectNode.class);
        JsonNode project = objectNode.get("bitbucketProject");
        JsonNode repository = objectNode.get("bitbucketRepository");

        return bitbucketService.getTopCommitters(project.asText(), repository.asText());
    }

}
