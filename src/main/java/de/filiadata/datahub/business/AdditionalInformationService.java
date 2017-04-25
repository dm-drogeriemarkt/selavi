package de.filiadata.datahub.business;

import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.business.bitbucket.TopCommitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AdditionalInformationService {

    private static final Logger LOG = LoggerFactory.getLogger(AdditionalInformationService.class);
    private static final String BITBUCKET_URL = "bitbucketUrl";
    private static final String IGNORED_COMMITTERS = "ignoredCommitters";

    private final BitbucketService bitbucketService;
    private final MetadataService metadataService;

    public AdditionalInformationService(BitbucketService bitbucketService, MetadataService metadataService) {
        this.bitbucketService = bitbucketService;
        this.metadataService = metadataService;
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

        final Map<String, String> metadataForMicroservice = metadataService.getMetadataForMicroservice(microserviceId);

        final String bitbucketUrl = metadataForMicroservice.get(BITBUCKET_URL);
        final String ignoredCommitters = metadataForMicroservice.get(IGNORED_COMMITTERS);

        if (bitbucketUrl != null) {
            LOG.info("Getting top committers for url {}", bitbucketUrl);
            return bitbucketService.getTopCommitters(bitbucketUrl, ignoredCommitters);

        }

        return Collections.emptyMap();
    }






}
