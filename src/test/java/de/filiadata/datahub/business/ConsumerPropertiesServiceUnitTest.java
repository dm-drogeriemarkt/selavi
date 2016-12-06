package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.domain.ServiceProperties;
import de.filiadata.datahub.repository.ServicePropertiesRepository;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.AdditionalAnswers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.*;

public class ConsumerPropertiesServiceUnitTest {
    private static final String SERVICE_NAME = "fry-service";
    private static final String RELATED_SERVICE_NAME = "bender-service";
    private static final String CONSUMER_NODE_NAME = "consumes";

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final ObjectMapper mapper = mock(ObjectMapper.class);
    private ConsumerPropertiesService service;

    @Before
    public void setUp() throws Exception {
        service = new ConsumerPropertiesService(servicePropertiesRepository, defaultNodeContentFactory);
    }

    @Test
    public void createShouldPersistNewServiceProperty() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ArrayNode arrayNode = mock(ArrayNode.class);
        final String content = "{some-content}";

        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(defaultNodeContentFactory.create(SERVICE_NAME)).thenReturn(objectNode);
        when(mapper.createArrayNode()).thenReturn(arrayNode);
        when(servicePropertiesRepository.save(any(ServiceProperties.class))).thenAnswer(AdditionalAnswers.returnsFirstArg());
        when(objectNode.toString()).thenReturn(content);

        // when
        final ServiceProperties result = service.createAndSaveNewProperties(SERVICE_NAME, RELATED_SERVICE_NAME);

        // then
        assertThat(result.getId(), Matchers.is(SERVICE_NAME));
        assertThat(result.getContent(), Matchers.is(content));
        verify(arrayNode).add(RELATED_SERVICE_NAME);
        verify(objectNode).set(CONSUMER_NODE_NAME, arrayNode);
        verify(servicePropertiesRepository).save(any(ServiceProperties.class));
    }

    @Test
    public void updateExistingShouldUpdateConsumerNodeIfItExists() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ArrayNode arrayNode = mock(ArrayNode.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(true);
        when(objectNode.get(CONSUMER_NODE_NAME)).thenReturn(arrayNode);

        // when
        service.updateExistingProperties(SERVICE_NAME, RELATED_SERVICE_NAME);

        // then
        verify(arrayNode).add(RELATED_SERVICE_NAME);
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
        verify(objectNode, never()).set(CONSUMER_NODE_NAME, arrayNode);
    }

    @Test
    public void updateExistingShouldAddPropertyIfItDoesNotExist() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ArrayNode arrayNode = mock(ArrayNode.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(false);
        when(mapper.createArrayNode()).thenReturn(arrayNode);

        // when
        service.updateExistingProperties(SERVICE_NAME, RELATED_SERVICE_NAME);

        // then
        verify(arrayNode).add(RELATED_SERVICE_NAME);
        verify(objectNode).set(CONSUMER_NODE_NAME, arrayNode);
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
    }
}