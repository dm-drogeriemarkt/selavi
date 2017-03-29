package de.filiadata.datahub.business;

import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AdditionalInformationServiceUnitTest {

    private AdditionalInformationService additionalInformationService;
    private BitbucketService bitbucketService = mock(BitbucketService.class);
    private ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);

    @Before
    public void setUp() throws Exception {
        this.additionalInformationService = new AdditionalInformationService(bitbucketService, servicePropertiesRepository);
    }

    @Test
    public void getTopCommitters() throws Exception {

        String microserviceId = "test-service";

        ServiceProperties serviceProperties = new ServiceProperties(microserviceId, "{\"bitbucketProject\": \"test-service\", \"bitbucketRepo\": \"test-repo\"}");
        when(servicePropertiesRepository.findById(microserviceId)).thenReturn(serviceProperties);

        Map<BitbucketAuthorDto, Long> topCommiters = new HashMap<>(3);
        topCommiters.put(new BitbucketAuthorDto("John Doe", "john@foo.bar", 5L, "Johnny"), 2L);
        when(bitbucketService.getTopCommitters(anyString(), anyString())).thenReturn(topCommiters);

        Map<BitbucketAuthorDto, Long> actualResult = additionalInformationService.getTopCommitters(microserviceId);

        assertThat(actualResult.isEmpty(), is(false));
        assertThat(actualResult.entrySet().isEmpty(), is(false));
        assertThat(actualResult.entrySet().size(), is(1));
    }

    @Test
    public void ioErrorReturnsEmptyMap() throws Exception {

        String microserviceId = "test-service";

        ServiceProperties serviceProperties = new ServiceProperties(microserviceId, "{\"bitbucketProject\": \"test-service\", \"bitbucketRepo\": \"test-repo\"}");
        when(servicePropertiesRepository.findById(microserviceId)).thenReturn(serviceProperties);

        when(bitbucketService.getTopCommitters(anyString(), anyString())).thenThrow(new IOException());

        Map<BitbucketAuthorDto, Long> actualResult = additionalInformationService.getTopCommitters(microserviceId);

        assertThat(actualResult.isEmpty(), is(true));
    }
}
