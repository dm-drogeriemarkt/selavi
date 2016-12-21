package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.semanticexceptions.PropertyAddException;
import de.filiadata.datahub.business.semanticexceptions.UnsupportedPropertyException;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

public class CustomPropertiesServiceUnitTest {

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final BlacklistPropertyService blacklistPropertyService = mock(BlacklistPropertyService.class);
    private final ObjectMapper mapper = mock(ObjectMapper.class);

    private static final String SERVICE_NAME = "SeLaVie";
    private static final String PROPERTY_NAME = "test";
    private static final String PROPERTY_VALUE = "me";

    private CustomPropertiesService service;

    @Before
    public void setUp() throws Exception {
        service = new CustomPropertiesService(servicePropertiesRepository, defaultNodeContentFactory, blacklistPropertyService);
    }

    @Test
    public void addNonExistingPropertyShouldPersistNewEntry() throws Exception {
        // given
        ObjectNode resultNode = mock(ObjectNode.class);
        ObjectNode propertyNode = new ObjectMapper().createObjectNode();
        propertyNode.set(PROPERTY_NAME, JsonNodeFactory.instance.textNode(PROPERTY_VALUE));

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(false);
        when(defaultNodeContentFactory.create(SERVICE_NAME)).thenReturn(resultNode);


        // when
        service.addSingleValueProperties(SERVICE_NAME, propertyNode);

        // then
        verify(defaultNodeContentFactory).create(SERVICE_NAME);
        verify(resultNode).set(PROPERTY_NAME, propertyNode.get(PROPERTY_NAME));
    }

    @Test
    public void addExistingPropertyToPersistedEntryShouldUpdateEntry() throws Exception {
        // given
        final ObjectNode propertyNode = new ObjectMapper().createObjectNode();
        propertyNode.set(PROPERTY_NAME, JsonNodeFactory.instance.textNode(PROPERTY_VALUE));

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
        service.addSingleValueProperties(SERVICE_NAME, propertyNode);

        // then
        verify(servicePropertiesRepository).findById(SERVICE_NAME);
        verify(defaultNodeContentFactory).getMapper();
        verify(serviceProperties).getContent();
        verify(objectNode).set(PROPERTY_NAME, propertyNode.get(PROPERTY_NAME));
    }

    @Test(expected = PropertyAddException.class)
    public void invalidJsonFromLoadedServicePropertiesShouldAbortTheUpdate() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final String existingPropertiesContent = "";
        final ObjectNode propertyNode = new ObjectMapper().createObjectNode();
        propertyNode.set(PROPERTY_NAME, JsonNodeFactory.instance.textNode(PROPERTY_VALUE));


        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(serviceProperties.getContent()).thenReturn(existingPropertiesContent);
        when(mapper.readTree(existingPropertiesContent)).thenThrow(new IOException("Unit Test ..."));

        // when
        service.addSingleValueProperties(SERVICE_NAME, propertyNode);

        // then
        verify(servicePropertiesRepository, never()).save(any(ServiceProperties.class));
    }

    @Test
    public void deletePropertyFromExistingServiceShouldRemoveIt() throws Exception {
        // given
        String propertyName = "somePropertyName";
        final List<String> propertyNames = Collections.singletonList(propertyName);
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);

        // when
        service.deleteProperty(SERVICE_NAME, propertyNames);

        // then
        verify(objectNode).remove(propertyName);
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
    }

    @Test
    public void noPropertiesShouldSkipRemoveOfProperty() throws Exception {
        // when
        service.deleteProperty(SERVICE_NAME, Collections.emptyList());

        // then
        verify(servicePropertiesRepository, never()).exists(SERVICE_NAME);
    }

    @Test
    public void notExistingServiceNameShouldSkipRemoveOfProperty() throws Exception {
        // given
        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(false);

        // when
        service.deleteProperty(SERVICE_NAME, Collections.singletonList("somePropertyName"));

        // then
        verify(servicePropertiesRepository, never()).findById(SERVICE_NAME);
    }

    @Test
    public void mandatoryPropertiesShouldNotBeRemoved() throws Exception {
        // given
        String propertyNameId = "id";
        String propertyNameLabel = "label";
        final List<String> propertyNames = Arrays.asList(propertyNameId, propertyNameLabel);
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(true);
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);

        // when
        service.deleteProperty(SERVICE_NAME, propertyNames);

        // then
        verify(objectNode, never()).remove(propertyNameId);
        verify(objectNode, never()).remove(propertyNameLabel);
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
    }

    @Test(expected = UnsupportedPropertyException.class)
    public void changingABlacklistPropertyShouldFail() throws Exception {
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ObjectNode propertyNode = new ObjectMapper().createObjectNode();
        propertyNode.set(PROPERTY_NAME, JsonNodeFactory.instance.textNode(PROPERTY_VALUE));

        when(servicePropertiesRepository.exists(SERVICE_NAME)).thenReturn(false);
        when(defaultNodeContentFactory.create(SERVICE_NAME)).thenReturn(objectNode);
        when(blacklistPropertyService.isBlacklistProperty(PROPERTY_NAME)).thenReturn(true);

        // when
        service.addSingleValueProperties(SERVICE_NAME, propertyNode);

        // then
        verify(defaultNodeContentFactory).create(SERVICE_NAME);
        verify(objectNode).set(PROPERTY_NAME, propertyNode.get(PROPERTY_NAME));
    }
}