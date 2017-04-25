package de.filiadata.datahub.business;

import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.business.bitbucket.TopCommitter;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class AdditionalInformationServiceUnitTest {

    private AdditionalInformationService additionalInformationService;
    private BitbucketService bitbucketService = mock(BitbucketService.class);
    private final MetadataService metadataService = mock(MetadataService.class);

    @Before
    public void setUp() throws Exception {
        this.additionalInformationService = new AdditionalInformationService(bitbucketService, metadataService);
    }

    @Test
    public void getTopCommitters() throws Exception {

        String microserviceId = "test-service";
        final Map<String, String> result = new HashMap<>();
        result.put("bitbucketUrl", "http://www.bitbucket.org");


        Map<BitbucketAuthorDto, Long> topCommiters = new HashMap<>(3);
        topCommiters.put(new BitbucketAuthorDto("John Doe", "john@foo.bar", 5L, "Johnny"), 2L);
        when(bitbucketService.getTopCommitters(anyString(), anyString())).thenReturn(topCommiters);
        when(metadataService.getMetadataForMicroservice(microserviceId)).thenReturn(result);


        final List<TopCommitter> namedTopCommitter = additionalInformationService.getNamedTopCommitter(microserviceId);
        assertFalse(namedTopCommitter.isEmpty());
        assertThat(namedTopCommitter.size(), is(1));

    }

}
