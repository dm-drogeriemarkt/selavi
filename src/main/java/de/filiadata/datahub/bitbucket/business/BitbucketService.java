package de.filiadata.datahub.bitbucket.business;

import de.filiadata.datahub.bitbucket.domain.BitbucketAuthorDto;
import de.filiadata.datahub.bitbucket.domain.BitbucketCommitsDto;
import de.filiadata.datahub.bitbucket.domain.BitbucketCommitterDto;
import de.filiadata.datahub.bitbucket.domain.TopCommitter;
import de.filiadata.datahub.microservices.business.MicroserviceContentProviderService;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.apache.commons.lang.StringUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class BitbucketService {

    private static final Logger LOG = LoggerFactory.getLogger(BitbucketService.class);

    private static final String BITBUCKET_URL = "bitbucketUrl";
    private static final String IGNORED_COMMITTERS = "ignoredCommitters";

    private final RestTemplate restTemplate;
    private final String bitbucketCredentials;
    private final Integer numberOfTopCommiters;
    private final MicroserviceContentProviderService microserviceContentProviderService;

    public BitbucketService(RestTemplate restTemplate,
                            @Value("${selavi.bitbucket.credentials}") String bitbucketCredentials,
                            @Value("${selavi.bitbucket.topcommitters.size}") Integer numberOfTopCommiters, MicroserviceContentProviderService microserviceContentProviderService) {
        this.restTemplate = restTemplate;
        this.bitbucketCredentials = bitbucketCredentials;
        this.numberOfTopCommiters = numberOfTopCommiters;
        this.microserviceContentProviderService = microserviceContentProviderService;
    }

    public List<TopCommitter> getNamedTopCommitter(String microserviceId) {
        final List<TopCommitter> result = new ArrayList<>();
        final Map<BitbucketAuthorDto, Long> topCommitters = getTopCommitters(microserviceId);

        LOG.info("Top commiter dtos: {}", topCommitters);

        for (final Map.Entry<BitbucketAuthorDto, Long> entry : topCommitters.entrySet()) {
            final BitbucketAuthorDto dto = entry.getKey();
            result.add(TopCommitter.builder().emailAddress(dto.getEmailAddress()).id(dto.getId()).name(dto.getName()).numberOfCommits(entry.getValue()).build());
        }

        return result;
    }

    public Map<BitbucketAuthorDto, Long> getTopCommitters(String microserviceId) {
        final MicroserviceDto microserviceDto = microserviceContentProviderService.getAllMicroservices().get(microserviceId);

        final String bitbucketUrl = microserviceDto.getBitbucketUrl();
        final String ignoredCommitters = microserviceDto.getIgnoredCommitters();
        if (bitbucketUrl != null) {
            final ResponseEntity<BitbucketCommitsDto> responseEntity = performRequest(bitbucketUrl + "/commits?limit=500");
            return handleResponse(responseEntity, ignoredCommitters);
        }

        return Collections.emptyMap();


    }

    public Map<BitbucketAuthorDto, Long> getTopCommitters(final String url, String ignoredCommiters) {
        final ResponseEntity<BitbucketCommitsDto> responseEntity = performRequest(url + "/commits?limit=500");

        return handleResponse(responseEntity, ignoredCommiters);
    }

    private Map<BitbucketAuthorDto, Long> handleResponse(ResponseEntity<BitbucketCommitsDto> responseEntity, String ignoredCommiters2) {
        final List<String> ignoredCommiters = StringUtils.isEmpty(ignoredCommiters2) ? Collections.<String>emptyList() : Arrays.<String>asList(ignoredCommiters2.split(","));

        final Map<BitbucketAuthorDto, Long> result = new LinkedHashMap<>();

        if (responseEntity.getStatusCode().equals(HttpStatus.OK) && responseEntity.hasBody()) {

            final BitbucketCommitsDto bitbucketCommitsDto = responseEntity.getBody();
            final Map<BitbucketAuthorDto, Long> allCommittersSorted = new LinkedHashMap<>();

            getAllCommiters(bitbucketCommitsDto).entrySet().stream()
                    .sorted(Map.Entry.<BitbucketAuthorDto, Long>comparingByValue().reversed())
                    .forEachOrdered(x -> allCommittersSorted.put(x.getKey(), x.getValue()));

            int i = 0;
            for (final Map.Entry<BitbucketAuthorDto, Long> entry : allCommittersSorted.entrySet()) {
                if (i < numberOfTopCommiters && !ignoredCommiters.contains(entry.getKey().getEmailAddress())) {
                    i++;
                    result.put(entry.getKey(), entry.getValue());
                }
                if (i == numberOfTopCommiters) {
                    break;
                }
            }
        }

        return result;
    }

    private ResponseEntity<BitbucketCommitsDto> performRequest(String url) {
        final HttpEntity<?> httpEntity = new HttpEntity<>(createHttpHeaders());
        try {
            LOG.info("Performing GET request to url {}, Headers: {}", url, httpEntity.getHeaders());
            return restTemplate.exchange(url,
                    HttpMethod.GET,
                    httpEntity,
                    new ParameterizedTypeReference<BitbucketCommitsDto>() {
                    }
            );
        } catch (RestClientException e) {
            LOG.error("Error while performing GET request to url {}!", url, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Map<BitbucketAuthorDto, Long> getAllCommiters(BitbucketCommitsDto bitbucketCommitsDto) {
        return bitbucketCommitsDto.getValues().stream()
                .collect(Collectors.groupingBy(BitbucketCommitterDto::getAuthor, Collectors.counting()));
    }

    private HttpHeaders createHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        String credentials = encodeCredentials();
        headers.set("Authorization", credentials);
        return headers;
    }

    private String encodeCredentials() {
        String prefix = "Basic ";
        String plainCredentials = bitbucketCredentials;
        byte[] plainCredentialsBytes = plainCredentials.getBytes(UTF_8);
        byte[] base64CredentialsBytes = Base64.encodeBase64(plainCredentialsBytes);
        String base64Credentials = new String(base64CredentialsBytes, UTF_8);

        return prefix + base64Credentials;
    }
}
