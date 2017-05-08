package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.microservices.repository.MicroserviceRepository;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class GatewayPropertiesContentProviderUnitTest {

    private final MicroserviceRepository microserviceRepository = mock(MicroserviceRepository.class);
    private GatewayPropertiesContentProvider provider;

    @Before
    public void setUp() throws Exception {
        provider = new GatewayPropertiesContentProvider(microserviceRepository);
    }

    @Test
    public void shouldReturnEmptyResultIfTheRepoReturnsNoResult() throws Exception {
        // given
        when(microserviceRepository.findAllServices()).thenReturn(Collections.emptyMap());

        // when
        Map<String, ObjectNode> result = provider.getContent();

        // then
        assertThat(result.isEmpty(), Matchers.is(true));
    }

    @Test
    public void shouldReturnContentFromRepository() throws Exception {
        // given
        final ObjectNode objectNode = mock(ObjectNode.class);
        final String serviceName = "someServiceName";
        final Map<String, ObjectNode> content = new HashMap<>();
        content.put(serviceName, objectNode);

        when(microserviceRepository.findAllServices()).thenReturn(content);

        // when
        Map<String, ObjectNode> result = provider.getContent();

        // then
        assertThat(result.size(), Matchers.is(1));
        assertThat(result.get(serviceName), Matchers.is(objectNode));
    }
}