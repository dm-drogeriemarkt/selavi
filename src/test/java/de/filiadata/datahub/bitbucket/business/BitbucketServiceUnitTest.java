package de.filiadata.datahub.bitbucket.business;

import de.filiadata.datahub.bitbucket.domain.BitbucketAuthorDto;
import de.filiadata.datahub.bitbucket.domain.BitbucketCommitsDto;
import de.filiadata.datahub.bitbucket.domain.BitbucketCommitterDto;
import de.filiadata.datahub.bitbucket.domain.TopCommitter;
import de.filiadata.datahub.microservices.business.MicroserviceContentProviderService;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.junit.Before;
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class BitbucketServiceUnitTest {

    private static final String BITBUCKET_URL = "http://www.foobar.com";
    private static final String IGNORED_COMMITERS = "foo@bar.de";
    private final RestTemplate restTemplate = mock(RestTemplate.class);
    private final MicroserviceContentProviderService microserviceContentProviderService = mock(MicroserviceContentProviderService.class, RETURNS_DEEP_STUBS);

    @Before
    public void setUp() {
        final MicroserviceDto dto = new MicroserviceDto();
        dto.setBitbucketUrl(BITBUCKET_URL);
        dto.setIgnoredCommitters(IGNORED_COMMITERS);
        when(microserviceContentProviderService.getAllMicroservices("dev").get("mocro01")).thenReturn(dto);
    }

    @Test
    public void testNumberOfTopCommiters() throws IOException {
        when(restTemplate.exchange(eq(BITBUCKET_URL + "/commits?limit=500"), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3, microserviceContentProviderService);
        final List<TopCommitter> topCommiters = bitbucketService.getNamedTopCommitter("dev","mocro01");
        assertThat(topCommiters.size(), is(3));
    }

    @Test
    public void testNoResultIsEmptyMap() throws IOException {
        when(restTemplate.exchange(eq(BITBUCKET_URL + "/commits?limit=500"), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getEmptyResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3, microserviceContentProviderService);
        final List<TopCommitter> topCommiters = bitbucketService.getNamedTopCommitter("dev", "mocro01");

        assertTrue(topCommiters.isEmpty());
    }



    @Test
    public void testOrderOfTopCommiters() throws IOException {

        when(restTemplate.exchange(eq(BITBUCKET_URL + "/commits?limit=500"), eq(HttpMethod.GET), any(HttpEntity.class), eq(new ParameterizedTypeReference<BitbucketCommitsDto>() {
        }))).thenReturn(getResponseEntity());

        final BitbucketService bitbucketService = new BitbucketService(restTemplate, "foo:bar", 3, microserviceContentProviderService);
        final List<TopCommitter> topCommiters = bitbucketService.getNamedTopCommitter("dev", "mocro01");
        assertThat(topCommiters.get(0).getEmailAddress(), is("foo1@bar.de"));
        assertThat(topCommiters.get(1).getEmailAddress(), is("foo4@bar.de"));
        assertThat(topCommiters.get(2).getEmailAddress(), is("foo2@bar.de"));
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