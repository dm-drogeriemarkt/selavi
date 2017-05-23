package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class MicroserviceConditioningServiceTest {

    private MicroserviceContentProviderService microserviceContentProviderService;
    private MicroserviceDtoFactory microserviceDtoFactory;
    private ServicePropertiesRepository servicePropertiesRepository;

    private MicroserviceConditioningService microserviceConditioningService;

    @Before
    public void setup() {
        microserviceContentProviderService = mock(MicroserviceContentProviderService.class);
        microserviceDtoFactory = mock(MicroserviceDtoFactory.class);
        servicePropertiesRepository = mock(ServicePropertiesRepository.class);

        microserviceConditioningService = new MicroserviceConditioningService(microserviceContentProviderService, microserviceDtoFactory, servicePropertiesRepository);
    }

    @Test
    public void deleteService() throws Exception {
        ServiceProperties serviceToBeDeleted = new ServiceProperties();
        serviceToBeDeleted.setContent("i_am_the_json_content");

        MicroserviceDto dtoOfServiceToBeDeleted = new MicroserviceDto();
        dtoOfServiceToBeDeleted.setExternal(true);

        when(servicePropertiesRepository.findOne(any(ServiceProperties.ServicePropertiesPk.class))).thenReturn(serviceToBeDeleted);
        when(microserviceDtoFactory.getMicroserviceDtoFromJSON("i_am_the_json_content")).thenReturn(dtoOfServiceToBeDeleted);

        microserviceConditioningService.deleteService("dev", "myFancyService");

        ArgumentCaptor<ServiceProperties.ServicePropertiesPk> pkArgumentCaptor = ArgumentCaptor.forClass(ServiceProperties.ServicePropertiesPk.class);

        verify(servicePropertiesRepository).findOne(pkArgumentCaptor.capture());
        assertThat(pkArgumentCaptor.getValue().getId(), is("myFancyService"));
        assertThat(pkArgumentCaptor.getValue().getStage(), is("dev"));

        verify(servicePropertiesRepository).delete(serviceToBeDeleted);
    }
}