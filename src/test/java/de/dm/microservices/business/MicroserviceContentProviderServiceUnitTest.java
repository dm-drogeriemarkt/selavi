package de.dm.microservices.business;

import de.dm.microservices.domain.MicroserviceDto;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class MicroserviceContentProviderServiceUnitTest {

    private static final String FROM_REGISTRY = "from Registry";
    private static final String FROM_PERSISTENCE = "from persistence";
    private static final String STAGE = "dev";
    private final ServiceRegistryContentProvider serviceRegistryContentProvider = mock(ServiceRegistryContentProvider.class);
    private final PersistenceContentProvider persistenceContentProvider = mock(PersistenceContentProvider.class);
    private final MicroserviceMergeService microserviceMergeService = mock(MicroserviceMergeService.class);
    private MicroserviceContentProviderService microserviceContentProviderService;


    @Before
    public void setUp() {
        microserviceContentProviderService = new MicroserviceContentProviderService(serviceRegistryContentProvider, persistenceContentProvider, microserviceMergeService);
    }

    @Test
    public void getAllMicroservicesMergesCorrectly() throws Exception {
        Map<String, MicroserviceDto> microservicesFromRegistry = new HashMap<>();
        microservicesFromRegistry.put("1", MicroserviceDto.builder().id("1").description(FROM_REGISTRY).build());
        microservicesFromRegistry.put("2", MicroserviceDto.builder().id("2").description(FROM_REGISTRY).build());
        microservicesFromRegistry.put("3", MicroserviceDto.builder().id("3").description(FROM_REGISTRY).build());
        microservicesFromRegistry.put("4", MicroserviceDto.builder().id("4").description(FROM_REGISTRY).build());

        Map<String, MicroserviceDto> microservicesFromPersistence = new HashMap<>();
        microservicesFromPersistence.put("3", MicroserviceDto.builder().id("3").description(FROM_PERSISTENCE).build());
        microservicesFromPersistence.put("4", MicroserviceDto.builder().id("4").description(FROM_PERSISTENCE).build());
        microservicesFromPersistence.put("5", MicroserviceDto.builder().id("5").description(FROM_PERSISTENCE).build());
        microservicesFromPersistence.put("6", MicroserviceDto.builder().id("6").description(FROM_PERSISTENCE).build());

        when(serviceRegistryContentProvider.getAllMicroservices(STAGE)).thenReturn(microservicesFromRegistry);
        when(persistenceContentProvider.getAllMicroservices(STAGE)).thenReturn(microservicesFromPersistence);
        when(microserviceMergeService.merge(microservicesFromRegistry.get("3"), microservicesFromPersistence.get("3"))).thenReturn(microservicesFromPersistence.get("3"));
        when(microserviceMergeService.merge(microservicesFromRegistry.get("4"), microservicesFromPersistence.get("4"))).thenReturn(microservicesFromPersistence.get("4"));
        Map<String, MicroserviceDto> result = microserviceContentProviderService.getAllMicroservices("dev");

        assertThat(result.entrySet(), hasSize(6));
        assertThat(result.get("1").getDescription(), is(FROM_REGISTRY));
        assertThat(result.get("2").getDescription(), is(FROM_REGISTRY));
        assertThat(result.get("3").getDescription(), is(FROM_PERSISTENCE));
        assertThat(result.get("4").getDescription(), is(FROM_PERSISTENCE));
        assertThat(result.get("5").getDescription(), is(FROM_PERSISTENCE));
        assertThat(result.get("6").getDescription(), is(FROM_PERSISTENCE));
    }

    @Test
    public void getMicroservicesFromPersistence() throws Exception {
        microserviceContentProviderService.getMicroservicesFromPersistence("dev");
        verify(persistenceContentProvider, times(1)).getAllMicroservices("dev");

    }

    @Test
    public void getMicroservicesFromServiceRegistry() throws Exception {
        microserviceContentProviderService.getMicroservicesFromServiceRegistry("dev");
        verify(serviceRegistryContentProvider, times(1)).getAllMicroservices("dev");

    }
}
