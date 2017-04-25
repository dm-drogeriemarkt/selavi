package de.filiadata.datahub.business;

import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.business.bitbucket.TopCommitter;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AdditionalInformationServiceUnitTest {

    private AdditionalInformationService additionalInformationService;
    private BitbucketService bitbucketService = mock(BitbucketService.class);
    private final PropertiesContentProviderService propertiesContentProviderService = mock(PropertiesContentProviderService.class);

    @Before
    public void setUp() throws Exception {
        this.additionalInformationService = new AdditionalInformationService(bitbucketService, propertiesContentProviderService);
    }

    @Test
    public void getTopCommitters() throws Exception {

        String microserviceId = "test-service";


        Map<BitbucketAuthorDto, Long> topCommiters = new HashMap<>(3);
        topCommiters.put(new BitbucketAuthorDto("John Doe", "john@foo.bar", 5L, "Johnny"), 2L);
        when(bitbucketService.getTopCommitters(anyString(), anyString())).thenReturn(topCommiters);

//        when(propertiesContentProviderService.getAllServicesWithContent())

        final List<TopCommitter> namedTopCommitter = additionalInformationService.getNamedTopCommitter(microserviceId);
        assertTrue(namedTopCommitter.isEmpty());
//        assertThat(namedTopCommitter.size(), is(1));

    }

}
