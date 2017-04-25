package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.business.bitbucket.TopCommitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdditionalInformationService {

    private static final Logger LOG = LoggerFactory.getLogger(AdditionalInformationService.class);
    private static final String BITBUCKET_URL = "bitbucketUrl";
    private static final String IGNORED_COMMITTERS = "ignoredCommitters";

    private final BitbucketService bitbucketService;
    private final PropertiesContentProviderService propertiesContentProviderService;

    public AdditionalInformationService(BitbucketService bitbucketService, PropertiesContentProviderService propertiesContentProviderService) {
        this.bitbucketService = bitbucketService;
        this.propertiesContentProviderService = propertiesContentProviderService;
    }

    public List<TopCommitter> getNamedTopCommitter(String microserviceId){
        final List<TopCommitter> result = new ArrayList<>();
        final Map<BitbucketAuthorDto, Long> topCommitters = getTopCommitters(microserviceId);

        LOG.info("Top commiter dtos: {}", topCommitters);

        for (final Map.Entry<BitbucketAuthorDto, Long> entry : topCommitters.entrySet()){
            final BitbucketAuthorDto dto = entry.getKey();
            result.add(TopCommitter.builder().emailAddress(dto.getEmailAddress()).id(dto.getId()).name(dto.getName()).numberOfCommits(entry.getValue()).build());
        }

        return result;
    }


    private Map<BitbucketAuthorDto, Long> getTopCommitters(String microserviceId) {

        final Map<String, String> bitbucketParamsFromRegistry = getBitbucketParamsFromRegistry(microserviceId);
        final String bitbucketUrl = bitbucketParamsFromRegistry.get(BITBUCKET_URL);
        final String ignoredCommitters = bitbucketParamsFromRegistry.get(IGNORED_COMMITTERS);

        if (bitbucketUrl != null) {
            LOG.info("Getting top committers for url {}", bitbucketUrl);
            return bitbucketService.getTopCommitters(bitbucketUrl, ignoredCommitters);

        }

        return Collections.emptyMap();
    }


    private Map<String, String> getBitbucketParamsFromRegistry(String microserviceId) {
        final Map<String, String> result = new HashMap<>();
        final Map<String, ObjectNode> allServicesWithContent = propertiesContentProviderService.getAllServicesWithContent();
        final ObjectNode objectNode = allServicesWithContent.get(microserviceId);
        if (objectNode == null) {
            return Collections.emptyMap();
        }
        final JsonNode metadata = objectNode.get("metadata");
        if (metadata == null || metadata.size() < 1) {
            return Collections.emptyMap();

        }

        final JsonNode metaDataNode = metadata.get(0);
        final JsonNode bitbucketUrlNode = metaDataNode.get(BITBUCKET_URL);
        final JsonNode ignoredCommittersNode = metaDataNode.get(IGNORED_COMMITTERS);
        if (bitbucketUrlNode != null) {
            result.put(BITBUCKET_URL, getValueFromArrayNode(bitbucketUrlNode));
        }

        if (ignoredCommittersNode != null) {
            result.put(IGNORED_COMMITTERS, getValueFromArrayNode(ignoredCommittersNode));
        }

        return result;
    }

    private String getValueFromArrayNode(JsonNode jsonNode) {
        if (jsonNode.size() > 0) {
            return jsonNode.get(0).asText();
        }

        return null;
    }



}
