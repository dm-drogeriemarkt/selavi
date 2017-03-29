package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Service
public class AdditionalInformationService {

    private static final Logger LOG = LoggerFactory.getLogger(AdditionalInformationService.class);

    private final BitbucketService bitbucketService;
    private final ServicePropertiesRepository servicePropertiesRepository;

    public AdditionalInformationService(BitbucketService bitbucketService, ServicePropertiesRepository servicePropertiesRepository) {
        this.bitbucketService = bitbucketService;
        this.servicePropertiesRepository = servicePropertiesRepository;
    }

    public Map<BitbucketAuthorDto, Long> getTopCommitters(String microserviceId) {

        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(microserviceId);
        if (serviceProperties == null) {
            return Collections.emptyMap();
        }
        final String content = serviceProperties.getContent();
        final ObjectMapper objectMapper = new ObjectMapper();

        try {

            ObjectNode objectNode = objectMapper.readValue(content, ObjectNode.class);
            JsonNode project = objectNode.get("bitbucketProject");
            JsonNode repository = objectNode.get("bitbucketRepo");

            if (null != project && null != repository) {
                return bitbucketService.getTopCommitters(project.asText(), repository.asText());
            }

        } catch (IOException e) {
            LOG.error("Error occurred while getting top committers:", e);
        }

        return Collections.emptyMap();
    }
}
