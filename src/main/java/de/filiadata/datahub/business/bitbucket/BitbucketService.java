package de.filiadata.datahub.business.bitbucket;

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

    private final RestTemplate restTemplate;
    private final String bitbucketCredentials;
    private final Integer numberOfTopCommiters;

    public BitbucketService(RestTemplate restTemplate,
                            @Value("${selavi.bitbucket.credentials}") String bitbucketCredentials,
                            @Value("${selavi.bitbucket.topcommitters.size}") Integer numberOfTopCommiters) {
        this.restTemplate = restTemplate;
        this.bitbucketCredentials = bitbucketCredentials;
        this.numberOfTopCommiters = numberOfTopCommiters;
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
