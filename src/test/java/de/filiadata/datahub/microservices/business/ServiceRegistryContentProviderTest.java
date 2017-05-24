package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.repository.ServiceRegistryRepository;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ServiceRegistryContentProviderTest {

    ServiceRegistryContentProvider serviceRegistryContentProvider;

    ServiceRegistryRepository serviceRegistryRepository;

    @Before
    public void setup() {
        serviceRegistryRepository = mock(ServiceRegistryRepository.class);

        serviceRegistryContentProvider = new ServiceRegistryContentProvider(serviceRegistryRepository);
    }

    @Test
    public void getAllStageNames() throws Exception {
        HashSet<String> stageNames = new HashSet<>(Arrays.asList("foo", "bar"));
        when(serviceRegistryRepository.getAllStageNames()).thenReturn(stageNames);

        Set<String> allStageNames = serviceRegistryContentProvider.getAllStageNames();

        assertThat(allStageNames, is(allStageNames));
    }
}