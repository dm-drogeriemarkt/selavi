package de.dm.bitbucket.business;

import de.dm.bitbucket.domain.BitbucketAuthorDto;
import de.dm.bitbucket.domain.BitbucketCommitsDto;
import de.dm.bitbucket.domain.BitbucketCommitterDto;
import de.dm.bitbucket.domain.TopCommitterDto;
import de.dm.microservices.business.MicroserviceContentProviderService;
import de.dm.microservices.domain.MicroserviceDto;
import org.apache.commons.lang.StringUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class BitbucketService {

    private static final Logger LOG = LoggerFactory.getLogger(BitbucketService.class);

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

    public List<TopCommitterDto> findNamedTopCommitters(String stage, String microserviceId) {
        final List<TopCommitterDto> result = new ArrayList<>();
        final Map<BitbucketAuthorDto, Long> topCommitters = getTopCommitters(stage, microserviceId);

        LOG.info("Top commiter dtos: {}", topCommitters);

        for (final Map.Entry<BitbucketAuthorDto, Long> entry : topCommitters.entrySet()) {
            final BitbucketAuthorDto dto = entry.getKey();
            result.add(TopCommitterDto.builder().emailAddress(dto.getEmailAddress()).id(dto.getId()).name(dto.getName()).numberOfCommits(entry.getValue()).build());
        }

        return result;
    }

    private Map<BitbucketAuthorDto, Long> getTopCommitters(String stage, String microserviceId) {

        final MicroserviceDto microserviceDto = microserviceContentProviderService.getAllMicroservices(stage).get(microserviceId);
        final String bitbucketUrl = microserviceDto.getBitbucketUrl();

        if (bitbucketUrl != null) {
            final ResponseEntity<BitbucketCommitsDto> responseEntity = performRequest(bitbucketUrl + "/commits?limit=500");
            BitbucketCommitsDto bitbucketCommitsDto = extractPayload(responseEntity);

            if (bitbucketCommitsDto != null) {
                Map<BitbucketAuthorDto, Long> allCommittersWithCount = extractCommittersWithCount(bitbucketCommitsDto);
                final Map<BitbucketAuthorDto, Long> allCommittersSorted = sortByCommitCount(allCommittersWithCount);
                List<String> ignoredCommitters = extractIgnoredCommitters(microserviceDto);
                return extractTopCommitters(ignoredCommitters, allCommittersSorted);
            }
        }

        return Collections.emptyMap();
    }

    private List<String> extractIgnoredCommitters(MicroserviceDto microserviceDto) {
        String ignoredCommittersProperty = microserviceDto.getIgnoredCommitters();
        return StringUtils.isEmpty(ignoredCommittersProperty) ? Collections.<String>emptyList() : Arrays.<String>asList(ignoredCommittersProperty.split(","));
    }

    private BitbucketCommitsDto extractPayload(ResponseEntity<BitbucketCommitsDto> responseEntity) {
        if (responseEntity.getStatusCode().equals(HttpStatus.OK) && responseEntity.hasBody()) {
            return responseEntity.getBody();
        }

        return null;
    }

    private Map<BitbucketAuthorDto, Long> extractTopCommitters(List<String> ignoredCommiters, Map<BitbucketAuthorDto, Long> allCommittersSorted) {

        final Map<BitbucketAuthorDto, Long> result = new LinkedHashMap<>();
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
        return result;
    }

    private Map<BitbucketAuthorDto, Long> sortByCommitCount(Map<BitbucketAuthorDto, Long> allCommittersWithCount) {
        final Map<BitbucketAuthorDto, Long> allCommittersSorted = new LinkedHashMap<>();
        allCommittersWithCount.entrySet().stream()
                .sorted(Map.Entry.<BitbucketAuthorDto, Long>comparingByValue().reversed())
                .forEachOrdered(x -> allCommittersSorted.put(x.getKey(), x.getValue()));
        return allCommittersSorted;
    }

    private Map<BitbucketAuthorDto, Long> extractCommittersWithCount(BitbucketCommitsDto bitbucketCommitsDto) {
        return bitbucketCommitsDto.getValues().stream()
                .collect(Collectors.groupingBy(BitbucketCommitterDto::getAuthor, Collectors.counting()));
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

    private HttpHeaders createHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        String credentials = encodeCredentials();
        headers.set("Authorization", credentials);
        return headers;
    }

    private String encodeCredentials() {
        String prefix = "Basic ";
        byte[] plainCredentialsBytes = bitbucketCredentials.getBytes(UTF_8);
        byte[] base64CredentialsBytes = Base64.encodeBase64(plainCredentialsBytes);
        String base64Credentials = new String(base64CredentialsBytes, UTF_8);

        return prefix + base64Credentials;
    }
}
