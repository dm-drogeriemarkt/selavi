package de.filiadata.datahub.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.repository.ConsumerRelationRepository;
import de.filiadata.datahub.repository.ServiceInfoRepository;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.Collection;
import java.util.HashMap;

import static org.hamcrest.core.Is.is;

public class ContentServiceUnitTest {

    private final MicroserviceReaderService microserviceReaderService = Mockito.mock(MicroserviceReaderService.class);
    private final ServiceInfoRepository serviceInfoRepository = Mockito.mock(ServiceInfoRepository.class);
    private final ConsumerRelationRepository consumerRelationRepository = Mockito.mock(ConsumerRelationRepository.class);
    private final ContentService service = new ContentService(microserviceReaderService, serviceInfoRepository, consumerRelationRepository);

    @Test
    public void shouldMergeNothinigIfNoDBContentIsAvailable() throws Exception {

        // given
        final HashMap<String, ObjectNode> microservicesMap = new HashMap<>();
        microservicesMap.put("customerconsent", createObjectNode("customerconsent", "https://example.com/customerconsent"));
        microservicesMap.put("kcb-assets", createObjectNode("kcb-assets", "https://example.com/kcb-assets"));
        microservicesMap.put("pir-gui", createObjectNode("pir-gui", "https://example.com/pir-gui"));

        Mockito.when(microserviceReaderService.readServices()).thenReturn(microservicesMap);

        // when
        Collection<ObjectNode> serviceInfo = service.getServicesWithContent();

        // then
        MatcherAssert.assertThat(serviceInfo.size(), is(3));
    }

    private ObjectNode createObjectNode(String serviceName, String url) {
        ObjectNode objectNode = new ObjectMapper().createObjectNode();
        objectNode.put("id", serviceName);
        objectNode.put("label", serviceName);
        objectNode.put("microservice-url", url);
        return objectNode;
    }
}