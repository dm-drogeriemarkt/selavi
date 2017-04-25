package de.filiadata.datahub.business.bitbucket;

import org.junit.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BitbucketServiceUnitTest {

    private final RestTemplate restTemplate = mock(RestTemplate.class);

    @Test
    public void testNumberOfTopCommiters() throws IOException {
        String href = "http://www.foobar.com/commits?limit=500";
        when(restTemplate.exchange(eq(href), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3);
        final Map<BitbucketAuthorDto, Long> topCommiters = bitbucketService.getTopCommitters("http://www.foobar.com", "foo@bar.de");
        assertThat(topCommiters.size(), is(3));
    }

    @Test
    public void testNoResultIsEmptyMap() throws IOException {
        String href = "http://www.foobar2.com/commits?limit=500";
        when(restTemplate.exchange(eq(href), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getEmptyResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3);
        final Map<BitbucketAuthorDto, Long> topCommiters = bitbucketService.getTopCommitters("http://www.foobar2.com", "foo@bar.de");
        assertTrue(topCommiters.isEmpty());
    }



    @Test
    public void testOrderOfTopCommiters() throws IOException {
        String href = "http://www.foobar.com/commits?limit=500";
        when(restTemplate.exchange(eq(href), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3);
        final Map<BitbucketAuthorDto, Long> topCommiters = bitbucketService.getTopCommitters("http://www.foobar.com", "foo@bar.de");

        final List<String> commiterEmails = topCommiters.entrySet().stream()
                .map(bitbucketAuthorDtoLongEntry -> bitbucketAuthorDtoLongEntry.getKey().getEmailAddress())
                .collect(Collectors.toList());

        assertThat(commiterEmails.get(0), is("foo1@bar.de"));
        assertThat(commiterEmails.get(1), is("foo4@bar.de"));
        assertThat(commiterEmails.get(2), is("foo2@bar.de"));
    }

    private ResponseEntity<BitbucketCommitsDto> getResponseEntity() {
        return new ResponseEntity<>(getMockedBitbucketCommitsDto(), HttpStatus.OK);
    }


    private ResponseEntity<BitbucketCommitsDto> getEmptyResponseEntity() {
        final BitbucketCommitsDto bitbucketCommitsDto = BitbucketCommitsDto.builder().lastPage(true).limit(10).nextPageStart(10).size(10).start(0).build();
        bitbucketCommitsDto.setValues(new ArrayList<>());
        return new ResponseEntity<>(bitbucketCommitsDto,HttpStatus.OK);
    }


    private BitbucketCommitsDto getMockedBitbucketCommitsDto(){
        final BitbucketCommitsDto bitbucketCommitsDto = BitbucketCommitsDto.builder().lastPage(true).limit(10).nextPageStart(10).size(10).start(0).build();
        bitbucketCommitsDto.setValues(new ArrayList<>());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo1 Bar1").emailAddress("foo1@bar.de").id(1L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo1 Bar1").emailAddress("foo1@bar.de").id(1L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo1 Bar1").emailAddress("foo1@bar.de").id(1L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo1 Bar1").emailAddress("foo1@bar.de").id(1L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo1 Bar1").emailAddress("foo1@bar.de").id(1L).build()).build());

        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo2 Bar2").emailAddress("foo2@bar.de").id(2L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo2 Bar2").emailAddress("foo2@bar.de").id(2L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo2 Bar2").emailAddress("foo2@bar.de").id(2L).build()).build());

        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo3 Bar3").emailAddress("foo3@bar.de").id(3L).build()).build());

        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo4 Bar4").emailAddress("foo4@bar.de").id(4L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo4 Bar4").emailAddress("foo4@bar.de").id(4L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo4 Bar4").emailAddress("foo4@bar.de").id(4L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo4 Bar4").emailAddress("foo4@bar.de").id(4L).build()).build());

        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo5 Bar5").emailAddress("foo5@bar.de").id(5L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo6 Bar6").emailAddress("foo6@bar.de").id(6L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo7 Bar7").emailAddress("foo7@bar.de").id(7L).build()).build());
        bitbucketCommitsDto.getValues().add(BitbucketCommitterDto.builder().author(BitbucketAuthorDto.builder().displayName("Foo8 Bar8").emailAddress("foo8@bar.de").id(8L).build()).build());

        return bitbucketCommitsDto;
    }

}