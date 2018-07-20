package de.dm.microservices.repository;

import de.dm.microservices.business.ServiceRegistryProperties;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import java.util.Set;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class ServiceRegistryRepositoryTest {

    private ServiceRegistryRepository serviceRegistryRepository;

    private String offlineMode;
    private ServiceRegistryProperties serviceRegistryProperties;

    @Before
    public void setup() {
        RestTemplate restTemplate = new RestTemplate();

        offlineMode = "false";
        serviceRegistryProperties = new ServiceRegistryProperties();

        serviceRegistryRepository = new ServiceRegistryRepository(restTemplate, offlineMode, serviceRegistryProperties);
    }

    @Test
    public void getAllStageNames() {

        serviceRegistryProperties.getUrl().put("foo", "bar");
        serviceRegistryProperties.getUrl().put("hello", "world");

        Set<String> allStageNames = serviceRegistryRepository.getAllStageNames();

        assertThat(allStageNames.size(), is(2));
        assertThat(allStageNames, hasItem("foo"));
        assertThat(allStageNames, hasItem("hello"));
    }

    @Test(expected = InvalidStageNameException.class)
    public void requestServicesThrowsExceptionWhenStageIsInvalid() {

        serviceRegistryProperties.getUrl().put("foo", "bar");
        serviceRegistryProperties.getUrl().put("hello", "world");

        serviceRegistryRepository.findAllServices("i_am_an_invalid_stage");
    }
}
