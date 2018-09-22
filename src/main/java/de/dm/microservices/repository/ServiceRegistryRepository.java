package de.dm.microservices.repository;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.dm.microservices.business.ServiceRegistryProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

@Service
public class ServiceRegistryRepository {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceRegistryRepository.class);

    private final RestTemplate restTemplate;
    private final Boolean offlineMode;
    private final Map<String, String> registryUrls;

    @Autowired
    public ServiceRegistryRepository(RestTemplate restTemplate,
                                     @Value("${development.offline-mode:false}") String offlineMode,
                                     ServiceRegistryProperties serviceRegistryProperties) {
        this.restTemplate = restTemplate;
        this.offlineMode = Boolean.parseBoolean(offlineMode);
        this.registryUrls = serviceRegistryProperties.getUrl();
    }


    @Cacheable("allmicroservices")
    public ResponseEntity<ObjectNode> findAllServices(String stage) {

        LOG.info("Load services from Registry ...");

        if (offlineMode) {
            LOG.info("Dev mode: not fetching microservices from registry, returning empty map...");
            return ResponseEntity.notFound().build();
        }

        ResponseEntity<ObjectNode> responseEntity;
        try {
            responseEntity = requestServices(stage);
        } catch (RestClientException ex) {
            LOG.warn("Error fetching microservices from registry, returning empty map...", ex);
            return ResponseEntity.notFound().build();
        }

        return responseEntity;
    }

    public Set<String> getAllStageNames() {
        return this.registryUrls.keySet();
    }

    private ResponseEntity<ObjectNode> requestServices(String stage) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));

        if (!registryUrls.containsKey(stage)) {
            throw new InvalidStageNameException("Invalid stage name \"" + stage + "\"");
        }

        String registryUrl = registryUrls.get(stage);

        final HttpEntity<String> httpEntity = new HttpEntity<>("parameters", headers);
        return restTemplate.exchange(registryUrl, HttpMethod.GET, httpEntity, ObjectNode.class);
    }
}
