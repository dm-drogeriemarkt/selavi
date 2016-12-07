package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.hamcrest.Matchers;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class PropertiesContentProviderServiceUnitTest {

    @Test
    public void providerShouldMergeContentFromSources() throws Exception {
        // given
        final ObjectMapper mapper = new ObjectMapper();
        final String serviceName = "serviceName";

        final GatewayPropertiesContentProvider gatewayPropertiesContentProvider = mock(GatewayPropertiesContentProvider.class);
        final PersistedPropertiesContentProvider persistedPropertiesContentProvider = mock(PersistedPropertiesContentProvider.class);
        final List<PropertiesContentProvider> allProviders = Arrays.asList(gatewayPropertiesContentProvider, persistedPropertiesContentProvider);

        final Map<String, ObjectNode> gatewayContent = new HashMap<>();
        final ObjectNode gatewayNode = mapper.createObjectNode();
        gatewayNode.put("fieldName", "unit");
        gatewayContent.put(serviceName, gatewayNode);

        final ObjectNode persistedNode = mapper.createObjectNode();
        persistedNode.put("newFieldName", "test");
        final Map<String, ObjectNode> persistedContent = new HashMap<>();
        persistedContent.put(serviceName, persistedNode);

        when(gatewayPropertiesContentProvider.getContent()).thenReturn(gatewayContent);
        when(persistedPropertiesContentProvider.getContent()).thenReturn(persistedContent);

        PropertiesContentProviderService provider = new PropertiesContentProviderService(allProviders);

        // when
        Map<String, ObjectNode> result = provider.getAllServicesWithContent();

        // then
        assertThat(result.size(), Matchers.is(1));

        ObjectNode resultNode = result.get(serviceName);
        assertThat(resultNode.size(), Matchers.is(2));
        assertThat(resultNode.hasNonNull("fieldName"), Matchers.is(true));
        assertThat(resultNode.hasNonNull("newFieldName"), Matchers.is(true));
    }
}