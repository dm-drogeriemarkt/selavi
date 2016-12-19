package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Test;

import java.util.Collections;
import java.util.Map;

import static org.mockito.Mockito.*;

public class ServicePropertiesServiceUnitTest {

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final ConsumerPropertiesService consumerPropertiesService = mock(ConsumerPropertiesService.class);
    private final CustomPropertiesService customPropertiesService = mock(CustomPropertiesService.class);
    private final PropertiesContentProviderService propertiesContentProviderService = mock(PropertiesContentProviderService.class);
    private final ServicePropertiesService service = new ServicePropertiesService(propertiesContentProviderService,
            servicePropertiesRepository,
            consumerPropertiesService,
            customPropertiesService);

    @Test
    public void shouldDelegateToContentProvider() throws Exception {

        // when
        service.getServicesWithContent();

        // then
        verify(propertiesContentProviderService).getAllServicesWithContent();
    }

    @Test
    public void shouldPersistNewServiceIfItDoesNotExist() throws Exception {
        // given
        final String serviceName = "serviceName";
        final ObjectNode objectNode = mock(ObjectNode.class);
        final JsonNode idNode = mock(JsonNode.class);

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(false);
        when(objectNode.get("id")).thenReturn(idNode);
        when(idNode.textValue()).thenReturn(serviceName);

        // when
        service.createNewServiceInfo(objectNode);

        // then
        verify(servicePropertiesRepository).save(any(ServiceProperties.class));
    }

    @Test
    public void shouldNotSaveNewServiceIfItExists() throws Exception {
        // given
        final String serviceName = "someName";
        final ObjectNode objectNode = mock(ObjectNode.class);
        final JsonNode idNode = mock(JsonNode.class);

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(true);
        when(objectNode.get("id")).thenReturn(idNode);
        when(idNode.textValue()).thenReturn(serviceName);

        // when
        service.createNewServiceInfo(objectNode);

        // then
        verify(servicePropertiesRepository, never()).save(any(ServiceProperties.class));
    }

    @Test
    public void shouldDeletegateToCustomPropertiesServiceToAddOrUpdateProperties() throws Exception {
        // given
        final String serviceName = "serviceName";
        final Map<String, String> properties = Collections.emptyMap();

        // when
        service.addProperties(serviceName, properties);

        // then
        verify(customPropertiesService).addSingleValueProperties(serviceName, properties);
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
        final String relatedServiceName = "relatedServiceName";

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(false);

        // when
        service.addRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).createAndSaveNewProperties(serviceName, relatedServiceName);
    }

    @Test
    public void shouldDelegateToConsumerServiceToUpdateRelations() throws Exception {
        // given
        final String serviceName = "ultraServiceName";
        final String relatedServiceName = "relatedServiceName";

        when(servicePropertiesRepository.exists(serviceName)).thenReturn(true);

        // when
        service.addRelation(serviceName, relatedServiceName);

        // then
        verify(consumerPropertiesService).updateExistingProperties(serviceName, relatedServiceName);
    }
}