package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

public class CustomPropertiesServiceUnitTest {

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final ObjectMapper mapper = mock(ObjectMapper.class);

    private static final String SERVICE_NAME = "SeLaVie";
    private static final String PROPERTY_NAME = "test";
    private static final String PROPERTY_VALUE = "me";

    private CustomPropertiesService service;

    @Before
    public void setUp() throws Exception {
        service = new CustomPropertiesService(servicePropertiesRepository, defaultNodeContentFactory);
    }

    @Test
    public void addNonExistingPropertyShouldPersistNewEntry() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final Map<String, String> properties = new HashMap<>();
        properties.put(PROPERTY_NAME, PROPERTY_VALUE);

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(false);
        when(defaultNodeContentFactory.create(SERVICE_NAME)).thenReturn(objectNode);


        // when
        service.addSingleValueProperties(SERVICE_NAME, properties);

        // then
        verify(defaultNodeContentFactory).create(SERVICE_NAME);
        verify(objectNode).put(PROPERTY_NAME, PROPERTY_VALUE);
    }

    @Test
    public void addExistingPropertyToPersistedEntryShouldUpdateEntry() throws Exception {
        // given
        final Map<String, String> properties = new HashMap<>();
        properties.put(PROPERTY_NAME, PROPERTY_VALUE);

        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final String existingPropertiesContent = "";
        final ObjectNode objectNode = mock(ObjectNode.class);

        when(serviceProperties.getContent()).thenReturn(existingPropertiesContent);
        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(existingPropertiesContent)).thenReturn(objectNode);
        when(objectNode.hasNonNull(PROPERTY_NAME)).thenReturn(true);

        // when
        service.addSingleValueProperties(SERVICE_NAME, properties);

        // then
        verify(servicePropertiesRepository).findById(SERVICE_NAME);
        verify(defaultNodeContentFactory).getMapper();
        verify(serviceProperties).getContent();
        verify(objectNode).set(eq(PROPERTY_NAME), any(JsonNode.class));
    }

    @Test
    public void invalidJsonFromLoadedServicePropertiesShouldAbortTheUpdate() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final String existingPropertiesContent = "";
        final Map<String, String> properties = new HashMap<>();
        properties.put(PROPERTY_NAME, PROPERTY_VALUE);

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(serviceProperties.getContent()).thenReturn(existingPropertiesContent);
        when(mapper.readTree(existingPropertiesContent)).thenThrow(new IOException("Unit Test ..."));

        // when
        service.addSingleValueProperties(SERVICE_NAME, properties);

        // then
        verify(servicePropertiesRepository, never()).save(any(ServiceProperties.class));
    }
}