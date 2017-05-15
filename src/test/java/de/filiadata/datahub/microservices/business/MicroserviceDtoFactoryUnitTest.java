package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.HostDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.junit.Test;

import java.util.Arrays;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class MicroserviceDtoFactoryUnitTest {
    @Test
    public void getMicroserviceDtoFromJSON() throws Exception {
        final String json = "{\"id\":\"id\",\"label\":\"label\",\"hosts\":[{\"hostName\":\"hostName\",\"ipAddr\":\"ipOfHost\",\"homePageUrl\":\"homepageUrl\",\"ports\":[80,81]}],\"consumes\":[{\"target\":\"target\",\"type\":\"type\",\"label\":\"labelConsume\"}],\"description\":\"description\",\"bitbucketUrl\":\"bitbucketUrl\",\"ignoredCommitters\":\"ignoredCommiters\",\"fdOwner\":\"fdOwner\",\"tags\":\"tags\",\"microserviceUrl\":\"microserviceUrl\",\"ipAddress\":\"ipAdress\",\"networkZone\":\"networkZone\",\"documentationLink\":\"documentationLink\",\"buildMonitorLink\":\"buidlMonitorLink\",\"monitoringLink\":\"monitoringLink\",\"external\":true}";

        final MicroserviceDtoFactory factory = new MicroserviceDtoFactory();
        final MicroserviceDto dto2 = factory.getMicroserviceDtoFromJSON(json);
        assertThat(dto2.getId(), is("id"));
        assertThat(dto2.getIgnoredCommitters(), is("ignoredCommiters"));
        assertThat(dto2.getBitbucketUrl(), is("bitbucketUrl"));
        assertThat(dto2.getLabel(), is("label"));
        assertThat(dto2.getBuildMonitorLink(), is("buidlMonitorLink"));
        assertThat(dto2.getDescription(), is("description"));
        assertThat(dto2.getDocumentationLink(), is("documentationLink"));
        assertThat(dto2.isExternal(), is(true));
        assertThat(dto2.getFdOwner(), is("fdOwner"));
        assertThat(dto2.getIpAddress(), is("ipAdress"));
        assertThat(dto2.getMicroserviceUrl(), is("microserviceUrl"));
        assertThat(dto2.getMonitoringLink(), is("monitoringLink"));
        assertThat(dto2.getNetworkZone(), is("networkZone"));
        assertThat(dto2.getTags(), is("tags"));

        assertThat(dto2.getConsumes().get(0).getLabel(), is("labelConsume"));
        assertThat(dto2.getConsumes().get(0).getTarget(), is("target"));
        assertThat(dto2.getConsumes().get(0).getType(), is("type"));

        assertThat(dto2.getHosts().get(0).getHomePageUrl(), is("homepageUrl"));
        assertThat(dto2.getHosts().get(0).getHostName(), is("hostName"));
        assertThat(dto2.getHosts().get(0).getIpAddr(), is("ipOfHost"));
        assertThat(dto2.getHosts().get(0).getPorts(), is(Arrays.asList(80, 81)));

    }

    @Test
    public void getJsonFromMicroserviceDto() throws Exception {
        final String expectedJson = "{\"id\":\"id\",\"label\":\"label\",\"hosts\":[{\"hostName\":\"hostName\",\"ipAddr\":\"ipOfHost\",\"homePageUrl\":\"homepageUrl\",\"ports\":[80,81]}],\"consumes\":[{\"target\":\"target\",\"type\":\"type\",\"label\":\"labelConsume\"}],\"description\":\"description\",\"bitbucketUrl\":\"bitbucketUrl\",\"ignoredCommitters\":\"ignoredCommiters\",\"fdOwner\":\"fdOwner\",\"tags\":\"tags\",\"microserviceUrl\":\"microserviceUrl\",\"ipAddress\":\"ipAdress\",\"networkZone\":\"networkZone\",\"documentationLink\":\"documentationLink\",\"buildMonitorLink\":\"buidlMonitorLink\",\"monitoringLink\":\"monitoringLink\",\"external\":true}";
        final MicroserviceDtoFactory factory = new MicroserviceDtoFactory();
        final MicroserviceDto dto = new MicroserviceDto();
        dto.setId("id");
        dto.setIgnoredCommitters("ignoredCommiters");
        dto.setBitbucketUrl("bitbucketUrl");
        dto.setLabel("label");
        dto.setBuildMonitorLink("buidlMonitorLink");
        dto.setDescription("description");
        dto.setDocumentationLink("documentationLink");
        dto.setExternal(true);
        dto.setFdOwner("fdOwner");
        dto.setIpAddress("ipAdress");
        dto.setMicroserviceUrl("microserviceUrl");
        dto.setMonitoringLink("monitoringLink");
        dto.setNetworkZone("networkZone");
        dto.setTags("tags");

        final ConsumeDto consumeDto = new ConsumeDto();
        consumeDto.setLabel("labelConsume");
        consumeDto.setTarget("target");
        consumeDto.setType("type");
        dto.getConsumes().add(consumeDto);

        final HostDto hostDto = new HostDto();
        hostDto.setHomePageUrl("homepageUrl");
        hostDto.setHostName("hostName");
        hostDto.setIpAddr("ipOfHost");
        hostDto.setPorts(Arrays.asList(80, 81));
        dto.getHosts().add(hostDto);

        final String json = factory.getJsonFromMicroserviceDto(dto);
        assertThat(json, is(expectedJson));

    }

}