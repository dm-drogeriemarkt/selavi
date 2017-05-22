package de.filiadata.datahub.microservices.repository;

import de.filiadata.datahub.microservices.business.DefaultNodeContentFactory;
import de.filiadata.datahub.microservices.business.MicroserviceDtoFactory;
import de.filiadata.datahub.microservices.business.ServiceRegistryProperties;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.Set;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.mock;

public class ServiceRegistryRepositoryTest {

    private ServiceRegistryRepository serviceRegistryRepository;

    private MockRestServiceServer mockRestServiceServer;
    private DefaultNodeContentFactory defaultNodeContentFactory;
    private String offlineMode;
    private MicroserviceDtoFactory microserviceDtoFactory;
    private ServiceRegistryProperties serviceRegistryProperties;

    @Before
    public void setup() {
        RestTemplate restTemplate = new RestTemplate();
        mockRestServiceServer = MockRestServiceServer.bindTo(restTemplate).build();

        defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
        offlineMode = "false";
        microserviceDtoFactory = mock(MicroserviceDtoFactory.class);
        serviceRegistryProperties = new ServiceRegistryProperties();

        serviceRegistryRepository = new ServiceRegistryRepository(restTemplate, defaultNodeContentFactory, offlineMode, microserviceDtoFactory, serviceRegistryProperties);
    }

    @Test
    public void getAllStageNames() throws Exception {

        serviceRegistryProperties.getUrl().put("foo", "bar");
        serviceRegistryProperties.getUrl().put("hello", "world");

        Set<String> allStageNames = serviceRegistryRepository.getAllStageNames();

        assertThat(allStageNames.size(), is(2));
        assertThat(allStageNames, hasItem("foo"));
        assertThat(allStageNames, hasItem("hello"));
    }
}