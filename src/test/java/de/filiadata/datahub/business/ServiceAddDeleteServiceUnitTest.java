package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.semanticexceptions.ServiceAddException;
import de.filiadata.datahub.business.semanticexceptions.ServiceDeleteException;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Test;

import static org.mockito.Mockito.*;

public class ServiceAddDeleteServiceUnitTest {

    public static final String SERVICE_NAME = "serviceName";
    public static final String FIELD_NAME_IS_EXTERNAL = "isExternal";
    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final ServiceAddDeleteService service = new ServiceAddDeleteService(servicePropertiesRepository, defaultNodeContentFactory);


    @Test(expected = ServiceDeleteException.class)
    public void shouldThrowExceptionForNotExistingService() throws Exception {
        // given
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(null);

        // when
        service.deleteService(SERVICE_NAME);
    }

    @Test(expected = ServiceDeleteException.class)
    public void shoudlThrowExceptionIfServiceIsNotAllowedToDelete() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ObjectMapper mapper = mock(ObjectMapper.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(FIELD_NAME_IS_EXTERNAL)).thenReturn(false);


        // when
        service.deleteService(SERVICE_NAME);
    }

    @Test
    public void shouldDeleteService() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ObjectMapper mapper = mock(ObjectMapper.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(FIELD_NAME_IS_EXTERNAL)).thenReturn(true);

        // when
        service.deleteService(SERVICE_NAME);

        // then
        verify(servicePropertiesRepository).delete(serviceProperties);
    }

    @Test(expected = ServiceAddException.class)
    public void shouldThrowExceptionWhenServiceToCreateAlreadyExists() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final JsonNode idNode = mock(JsonNode.class);

        when(objectNode.get("id")).thenReturn(idNode);
        when(idNode.textValue()).thenReturn(SERVICE_NAME);
        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);

        // when
        service.createNewServiceInfo(objectNode);
    }

    @Test
    public void shouldCreateNewServiceProperties() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final JsonNode idNode = mock(JsonNode.class);

        when(objectNode.get("id")).thenReturn(idNode);
        when(idNode.textValue()).thenReturn(SERVICE_NAME);
        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(false);

        // when
        service.createNewServiceInfo(objectNode);

        // then
        verify(servicePropertiesRepository).save(any(ServiceProperties.class));
    }
}