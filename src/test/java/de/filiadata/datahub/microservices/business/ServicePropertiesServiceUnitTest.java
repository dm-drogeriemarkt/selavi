package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.junit.Test;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;

public class ServicePropertiesServiceUnitTest {

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final ConsumerPropertiesService consumerPropertiesService = mock(ConsumerPropertiesService.class);
    private final CustomPropertiesService customPropertiesService = mock(CustomPropertiesService.class);
    private final ServiceAddDeleteService serviceAddDeleteService = mock(ServiceAddDeleteService.class);
    private final PropertiesContentProviderService propertiesContentProviderService = mock(PropertiesContentProviderService.class);
    private final ServicePropertiesService service = new ServicePropertiesService(propertiesContentProviderService,
            servicePropertiesRepository,
            consumerPropertiesService,
            customPropertiesService,
            serviceAddDeleteService);

    @Test
    public void shouldDelegateToContentProvider() throws Exception {
        // when
        service.getServicesWithContent();

        // then
        verify(propertiesContentProviderService).getAllServicesWithContent();
    }

    @Test
    public void shouldDeletegateToCustomPropertiesServiceToAddOrUpdateProperties() throws Exception {
        // given
        final String serviceName = "serviceName";
        final ObjectNode propertyNode = new ObjectMapper().createObjectNode();

        // when
        service.addProperties(serviceName, propertyNode);

        // then
        verify(customPropertiesService).addSingleValueProperties(serviceName, propertyNode);
    }

    @Test
    public void shouldDeletegateToCustomPropertiesServiceToDeleteProperties() throws Exception {
        // given
        final String serviceName = "fooName";
        String propertyName = "";

        // when
        service.deleteProperty(serviceName, propertyName);

        // then
        verify(customPropertiesService).deleteProperty(serviceName, Collections.singletonList(propertyName));
    }

    @Test
    public void shouldDelegateToConsumerServiceToCreateNewRelation() throws Exception {
        // given
        final String serviceName = "ultraServiceName";
        final ObjectNode relatedServiceName = new ObjectMapper().createObjectNode();

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(false);

        // when
        service.saveRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).createAndSaveNewProperties(serviceName, relatedServiceName);
    }

    @Test
    public void shouldDelegateToConsumerServiceToUpdateRelations() throws Exception {
        // given
        final String serviceName = "ultraServiceName";
        final ObjectNode relatedServiceName = new ObjectMapper().createObjectNode();

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(true);
        when(consumerPropertiesService.saveOrMergeRelationProperties(eq(serviceName), any(ObjectNode.class), eq(Optional.empty()))).thenCallRealMethod();

        // when
        service.saveRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).saveRelationProperties(serviceName, relatedServiceName);
    }
}