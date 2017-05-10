package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.microservices.business.semanticexceptions.RelationAddException;
import de.filiadata.datahub.microservices.business.semanticexceptions.RelationRemoveException;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.AdditionalAnswers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

public class ConsumerPropertiesServiceUnitTest {

    private static final String SERVICE_NAME = "fry-service";
    private static final ObjectNode RELATED_SERVICE_NODE = new ObjectMapper().createObjectNode().put("target", "");
    private static final String CONSUMER_NODE_NAME = "consumes";
    private static final String RELATED_SERVICE_NAME = "bender-service";

    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final RelationArrayNodeMerger relationArrayNodeMerger = mock(RelationArrayNodeMerger.class);
    private final ObjectMapper mapper = mock(ObjectMapper.class);
    private ConsumerPropertiesService service;

    @Before
    public void setUp() throws Exception {
        service = new ConsumerPropertiesService(servicePropertiesRepository, defaultNodeContentFactory, relationArrayNodeMerger);
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
        final ServiceProperties result = service.createAndSaveNewProperties(SERVICE_NAME, RELATED_SERVICE_NODE);

        // then
        assertThat(result.getId(), is(SERVICE_NAME));
        assertThat(result.getContent(), is(content));
        verify(arrayNode).add(RELATED_SERVICE_NODE);
        verify(objectNode).set(CONSUMER_NODE_NAME, arrayNode);
        verify(servicePropertiesRepository).save(any(ServiceProperties.class));
    }

    @Test
    public void shouldUpdateConsumerNodeIfItExists() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final ObjectNode objectNode = mock(ObjectNode.class);
        final ArrayNode arrayNode = new ObjectMapper().createArrayNode();
        ObjectNode targetProperties = new ObjectMapper().createObjectNode().put("target", "newService");
        arrayNode.add(targetProperties);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(true);
        when(objectNode.get(CONSUMER_NODE_NAME)).thenReturn(arrayNode);

        // when
        service.saveRelationProperties(SERVICE_NAME, targetProperties);

        // then
        assertThat(arrayNode.size(), is(1));
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
        ObjectNode targetProperties = new ObjectMapper().createObjectNode().put("target", SERVICE_NAME);
        arrayNode.add(targetProperties);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(objectNode.hasNonNull(CONSUMER_NODE_NAME)).thenReturn(true);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(objectNode.get(CONSUMER_NODE_NAME)).thenReturn(arrayNode);

        // when
        service.saveRelationProperties(SERVICE_NAME, targetProperties);

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
        service.saveRelationProperties(SERVICE_NAME, RELATED_SERVICE_NODE);

        // then
        verify(arrayNode).add(RELATED_SERVICE_NODE);
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

        arrayNode.add(objectMapper.createObjectNode().put("target", "FOO"));
        arrayNode.add(objectMapper.createObjectNode().put("target", "BAZ"));
        objectNode.set(CONSUMER_NODE_NAME, arrayNode);

        final ServiceProperties serviceProperties = mock(ServiceProperties.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(mapper.createObjectNode()).thenReturn(resultNode);

        // when
        service.removeRelation(SERVICE_NAME, "FOO");

        // then
        assertThat(resultNode.size(), is(1));

        //when
        service.removeRelation(SERVICE_NAME, "BAZ");

        // then
        assertThat(resultNode.hasNonNull(CONSUMER_NODE_NAME), is(true));

        verify(serviceProperties).setContent(resultNode.toString());
        verify(servicePropertiesRepository, times(2)).save(serviceProperties);
    }

    @Test(expected = RelationRemoveException.class)
    public void shouldFailIfRelationToRemoveDoesNotExist() throws Exception {
        // given
        final ObjectMapper objectMapper = new ObjectMapper();
        final ObjectNode objectNode = objectMapper.createObjectNode();
        final ObjectNode resultNode = objectMapper.createObjectNode();
        final ArrayNode arrayNode = objectMapper.createArrayNode();
        objectNode.set(CONSUMER_NODE_NAME, arrayNode);

        final ServiceProperties serviceProperties = mock(ServiceProperties.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(mapper.createObjectNode()).thenReturn(resultNode);
        ObjectNode targetNode = new ObjectMapper().createObjectNode();

        targetNode.put("target", "FOO");

        // when
        service.removeRelation(SERVICE_NAME, "FOO");
    }

    @Test(expected = RelationAddException.class)
    public void shouldFailIfRelationPointsToSameService() throws Exception {
        // given
        final ObjectMapper objectMapper = new ObjectMapper();
        final ObjectNode objectNode = objectMapper.createObjectNode();
        final ObjectNode resultNode = objectMapper.createObjectNode();
        final ArrayNode arrayNode = objectMapper.createArrayNode();
        objectNode.set(CONSUMER_NODE_NAME, arrayNode);

        final ServiceProperties serviceProperties = mock(ServiceProperties.class);

        when(servicePropertiesRepository.findById(SERVICE_NAME)).thenReturn(serviceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);
        when(mapper.createObjectNode()).thenReturn(resultNode);
        ObjectNode targetNode = new ObjectMapper().createObjectNode();
        targetNode.put("target", SERVICE_NAME);

        // when
        service.saveRelationProperties(SERVICE_NAME, targetNode);
    }
}