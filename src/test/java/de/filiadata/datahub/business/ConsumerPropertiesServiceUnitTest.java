package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.semanticexceptions.RelationAddException;
import de.filiadata.datahub.business.semanticexceptions.RelationRemoveException;
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
    public void shouldUpdateConsumerNodeIfItExists() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ArrayNode arrayNode = new ObjectMapper().createArrayNode();

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(true);
        when(objectNode.get(CONSUMER_NODE_NAME)).thenReturn(arrayNode);

        // when
        service.addConsumedService(SERVICE_NAME, RELATED_SERVICE_NAME);

        // then
        assertThat(arrayNode.size(), Matchers.is(1));
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
        verify(objectNode, never()).set(CONSUMER_NODE_NAME, arrayNode);
    }

    @Test(expected = RelationAddException.class)
    public void shouldFailIfSameRelationIsAddedTwice() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ArrayNode arrayNode = new ObjectMapper().createArrayNode();
        arrayNode.add("FOO");

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(true);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.get(CONSUMER_NODE_NAME)).thenReturn(arrayNode);

        // when
        service.addConsumedService(SERVICE_NAME, "FOO");
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
        service.addConsumedService(SERVICE_NAME, RELATED_SERVICE_NAME);

        // then
        verify(arrayNode).add(RELATED_SERVICE_NAME);
        verify(objectNode).set(CONSUMER_NODE_NAME, arrayNode);
        verify(serviceProperties).setContent(objectNode.toString());
        verify(servicePropertiesRepository).save(serviceProperties);
    }

    @Test(expected = RelationRemoveException.class)
    public void shouldThrowExceptionForNotExistingServiceName() throws Exception {
        // given
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(null);

        // when
        service.removeRelation(SERVICE_NAME, RELATED_SERVICE_NAME);
    }

    @Test(expected = RelationRemoveException.class)
    public void shouldThrowExceptionForEmptyRelatedServiceName() throws Exception {
        // given
        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(null);

        // when
        service.removeRelation(SERVICE_NAME, "");
    }

    @Test
    public void shouldRemoveRelation() throws Exception {
        // given
        final ObjectMapper objectMapper = new ObjectMapper();
        final ObjectNode objectNode = objectMapper.createObjectNode();
        final ObjectNode resultNode = objectMapper.createObjectNode();
        final ArrayNode arrayNode = objectMapper.createArrayNode();
        arrayNode.add("FOO");
        arrayNode.add("BAZ");
        objectNode.set(CONSUMER_NODE_NAME, arrayNode);

        final ServiceProperties serviceProperties = mock(ServiceProperties.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(mapper.createObjectNode()).thenReturn(resultNode);

        // when
        service.removeRelation(SERVICE_NAME, "FOO");

        // then
        assertThat(resultNode.size(), Matchers.is(1));

        //when
        service.removeRelation(SERVICE_NAME, "BAZ");

        // then
        assertThat(resultNode.hasNonNull(CONSUMER_NODE_NAME), Matchers.is(false));

        verify(serviceProperties).setContent(resultNode.toString());
        verify(servicePropertiesRepository, times(2)).save(serviceProperties);
    }
}