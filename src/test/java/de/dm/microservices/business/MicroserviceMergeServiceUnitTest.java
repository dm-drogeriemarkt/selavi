package de.dm.microservices.business;

import de.dm.microservices.domain.ConsumeDto;
import de.dm.microservices.domain.HostDto;
import de.dm.microservices.domain.MicroserviceDto;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class MicroserviceMergeServiceUnitTest {

    private final MicroserviceMergeService microserviceMergeService = new MicroserviceMergeService();

    @Test
    public void mergeAllFields() {
        MicroserviceDto sampleMicroservice = getSampleMicroservice();
        MicroserviceDto result = microserviceMergeService.merge(new MicroserviceDto(), sampleMicroservice);
        assertThat(result.getId(), is(sampleMicroservice.getId()));
        assertThat(result.getDescription(), is(sampleMicroservice.getDescription()));
        assertThat(result.getConsumes(), is(sampleMicroservice.getConsumes()));
        assertThat(result.getHosts(), is(sampleMicroservice.getHosts()));
        assertThat(result.getBitbucketUrl(), is(sampleMicroservice.getBitbucketUrl()));
        assertThat(result.getIgnoredCommitters(), is(sampleMicroservice.getIgnoredCommitters()));
        assertThat(result.getBuildMonitorLink(), is(sampleMicroservice.getBuildMonitorLink()));
        assertThat(result.getDocumentationLink(), is(sampleMicroservice.getDocumentationLink()));
        assertThat(result.getFdOwner(), is(sampleMicroservice.getFdOwner()));
        assertThat(result.getIpAddress(), is(sampleMicroservice.getIpAddress()));
        assertThat(result.getLabel(), is(sampleMicroservice.getLabel()));
        assertThat(result.getMicroserviceUrl(), is(sampleMicroservice.getMicroserviceUrl()));
        assertThat(result.getNetworkZone(), is(sampleMicroservice.getNetworkZone()));
        assertThat(result.getTags(), is(sampleMicroservice.getTags()));

    }

    @Test
    public void mergeNoFields() {
        MicroserviceDto sampleMicroservice = getSampleMicroservice();
        MicroserviceDto result = microserviceMergeService.merge(sampleMicroservice, MicroserviceDto.builder().id("id02").build());
        assertThat(result.getId(), is("id02"));
        assertThat(result.getDescription(), is(sampleMicroservice.getDescription()));
        assertThat(result.getConsumes(), is(sampleMicroservice.getConsumes()));
        assertThat(result.getHosts(), is(sampleMicroservice.getHosts()));
        assertThat(result.getBitbucketUrl(), is(sampleMicroservice.getBitbucketUrl()));
        assertThat(result.getIgnoredCommitters(), is(sampleMicroservice.getIgnoredCommitters()));
        assertThat(result.getBuildMonitorLink(), is(sampleMicroservice.getBuildMonitorLink()));
        assertThat(result.getDocumentationLink(), is(sampleMicroservice.getDocumentationLink()));
        assertThat(result.getFdOwner(), is(sampleMicroservice.getFdOwner()));
        assertThat(result.getIpAddress(), is(sampleMicroservice.getIpAddress()));
        assertThat(result.getLabel(), is(sampleMicroservice.getLabel()));
        assertThat(result.getMicroserviceUrl(), is(sampleMicroservice.getMicroserviceUrl()));
        assertThat(result.getNetworkZone(), is(sampleMicroservice.getNetworkZone()));
        assertThat(result.getTags(), is(sampleMicroservice.getTags()));

    }

    @Test
    public void mergeNull() {
        MicroserviceDto sampleMicroservice = getSampleMicroservice();
        MicroserviceDto result = microserviceMergeService.merge(sampleMicroservice, null);
        assertThat(result.getId(), is("id01"));
        assertThat(result.getDescription(), is(sampleMicroservice.getDescription()));
        assertThat(result.getConsumes(), is(sampleMicroservice.getConsumes()));
        assertThat(result.getHosts(), is(sampleMicroservice.getHosts()));
        assertThat(result.getBitbucketUrl(), is(sampleMicroservice.getBitbucketUrl()));
        assertThat(result.getIgnoredCommitters(), is(sampleMicroservice.getIgnoredCommitters()));
        assertThat(result.getBuildMonitorLink(), is(sampleMicroservice.getBuildMonitorLink()));
        assertThat(result.getDocumentationLink(), is(sampleMicroservice.getDocumentationLink()));
        assertThat(result.getFdOwner(), is(sampleMicroservice.getFdOwner()));
        assertThat(result.getIpAddress(), is(sampleMicroservice.getIpAddress()));
        assertThat(result.getLabel(), is(sampleMicroservice.getLabel()));
        assertThat(result.getMicroserviceUrl(), is(sampleMicroservice.getMicroserviceUrl()));
        assertThat(result.getNetworkZone(), is(sampleMicroservice.getNetworkZone()));
        assertThat(result.getTags(), is(sampleMicroservice.getTags()));

    }

    private Map<String, MicroserviceDto> getSourceMicroserices() {
        final Map<String, MicroserviceDto> result = new HashMap<>();
        final MicroserviceDto dto1 = new MicroserviceDto();
        dto1.setId("id01");
        result.put(dto1.getId(), dto1);

        final MicroserviceDto dto2 = new MicroserviceDto();
        dto2.setId("id03");
        result.put(dto2.getId(), dto2);

        return result;

    }

    private MicroserviceDto getSampleMicroservice() {
        final MicroserviceDto dto1 = new MicroserviceDto();
        dto1.setId("id01");
        dto1.setIgnoredCommitters("ignoredCommiters");
        dto1.setBitbucketUrl("bitbucketUrl");
        dto1.setLabel("label");
        dto1.setBuildMonitorLink("buidlMonitorLink");
        dto1.setDescription("description");
        dto1.setDocumentationLink("documentationLink");
        dto1.setExternal(true);
        dto1.setFdOwner("fdOwner");
        dto1.setIpAddress("ipAdress");
        dto1.setMicroserviceUrl("microserviceUrl");
        dto1.setMonitoringLink("monitoringLink");
        dto1.setNetworkZone("networkZone");
        dto1.setTags("tags");
        dto1.setHosts(Collections.singletonList(new HostDto()));
        dto1.setConsumes(Collections.singletonList(new ConsumeDto()));


        return dto1;

    }


}
