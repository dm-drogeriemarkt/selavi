package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

public class MicroserviceContentProviderServiceUnitTest {

    private final ServiceRegistryContentProvider serviceRegistryContentProvider = mock(ServiceRegistryContentProvider.class);
    private final PersistenceContentProvider persistenceContentProvider = mock(PersistenceContentProvider.class);
    private final MicroserviceMergeService microserviceMergeService = mock(MicroserviceMergeService.class);


    @Before
    public void setUp() {

    }

    @Test
    public void getAllMicroservices() throws Exception {
        final Map<String, MicroserviceDto> resultMap = getResultMap();
        when(persistenceContentProvider.getAllMicroservices("dev")).thenReturn(resultMap);
        when(serviceRegistryContentProvider.getAllMicroservices("dev")).thenReturn(resultMap);
        final MicroserviceContentProviderService microserviceContentProviderService = new MicroserviceContentProviderService(serviceRegistryContentProvider, persistenceContentProvider, microserviceMergeService);
        final Map<String, MicroserviceDto> allMicroservices = microserviceContentProviderService.getAllMicroservices("dev");
        verify(microserviceMergeService, times(1)).mergeCompleteMicroservices(resultMap, resultMap);
    }

    @Test
    public void getMicroservicesFromPersistence() throws Exception {
        final MicroserviceContentProviderService microserviceContentProviderService = new MicroserviceContentProviderService(serviceRegistryContentProvider, persistenceContentProvider, microserviceMergeService);
        microserviceContentProviderService.getMicroservicesFromPersistence("dev");
        verify(persistenceContentProvider, times(1)).getAllMicroservices("dev");

    }

    @Test
    public void getMicroservicesFromServiceRegistry() throws Exception {
        final MicroserviceContentProviderService microserviceContentProviderService = new MicroserviceContentProviderService(serviceRegistryContentProvider, persistenceContentProvider, microserviceMergeService);
        microserviceContentProviderService.getMicroservicesFromServiceRegistry("dev");
        verify(serviceRegistryContentProvider, times(1)).getAllMicroservices("dev");

    }

    private Map<String, MicroserviceDto> getResultMap() {
        final Map<String, MicroserviceDto> result = new HashMap<>();
        final MicroserviceDto dto01 = new MicroserviceDto();
        dto01.setId("id01");
        final MicroserviceDto dto02 = new MicroserviceDto();
        dto02.setId("id02");
        result.put(dto01.getId(), dto01);
//        result.put(dto02.getId(), dto02);

        return result;
    }

}