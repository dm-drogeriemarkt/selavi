package de.filiadata.datahub.selavi.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.selavi.domain.ServiceProperties;
import de.filiadata.datahub.selavi.repository.ServicePropertiesRepository;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class PersistedPropertiesContentProviderUnitTest {

    private final DefaultNodeContentFactory defaultNodeContentFactory = mock(DefaultNodeContentFactory.class);
    private final ServicePropertiesRepository servicePropertiesRepository = mock(ServicePropertiesRepository.class);
    private PersistedPropertiesContentProvider provider;

    @Before
    public void setUp() throws Exception {
        provider = new PersistedPropertiesContentProvider(servicePropertiesRepository, defaultNodeContentFactory);
    }

    @Test
    public void shouldReturnEmptyMapIfNoContentWasPersisted() throws Exception {
        // given
        when(servicePropertiesRepository.findAll()).thenReturn(Collections.emptyList());

        // when
        Map<String, ObjectNode> result = provider.getContent();

        // then
        assertThat(result.isEmpty(), Matchers.is(true));
    }

    @Test
    public void shouldReturnPersistedContent() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final List<ServiceProperties> allServiceProperties = Collections.singletonList(serviceProperties);
        final ObjectMapper mapper = mock(ObjectMapper.class);
        final ObjectNode objectNode = mock(ObjectNode.class);

        when(servicePropertiesRepository.findAll()).thenReturn(allServiceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenReturn(objectNode);

        // when
        Map<String, ObjectNode> result = provider.getContent();

        // then
        assertThat(result.size(), Matchers.is(1));
        assertThat(result.values().iterator().next(), Matchers.is(objectNode));
    }

    @Test
    public void contentShouldBeSkippedIfAPersistedEntryIsNoJson() throws Exception {
        // given
        final ServiceProperties serviceProperties = mock(ServiceProperties.class);
        final List<ServiceProperties> allServiceProperties = Collections.singletonList(serviceProperties);
        final ObjectMapper mapper = mock(ObjectMapper.class);

        when(servicePropertiesRepository.findAll()).thenReturn(allServiceProperties);
        when(defaultNodeContentFactory.getMapper()).thenReturn(mapper);
        when(mapper.readTree(serviceProperties.getContent())).thenThrow(new IOException("Unit Test ..."));

        // when
        Map<String, ObjectNode> result = provider.getContent();

        // then
        assertThat(result.isEmpty(), Matchers.is(true));
    }
}