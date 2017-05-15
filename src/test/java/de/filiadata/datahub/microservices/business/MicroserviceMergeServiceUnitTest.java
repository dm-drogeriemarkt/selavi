package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.HostDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class MicroserviceMergeServiceUnitTest {

    @Test
    public void testMergeCompleteMicroservices() {
        final Map<String, MicroserviceDto> microsericesToMerge = getMicrosericesToMerge();
        final Map<String, MicroserviceDto> sourceMicroserices = getSourceMicroserices();

        final MicroserviceMergeService microserviceMergeService = new MicroserviceMergeService();
        final Map<String, MicroserviceDto> resultMap = microserviceMergeService.mergeCompleteMicroservices(sourceMicroserices, microsericesToMerge);

        assertThat(resultMap.size(), is(3));
        assertThat(resultMap.get("id01").getIgnoredCommitters(), is("ignoredCommiters"));

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

    private Map<String, MicroserviceDto> getMicrosericesToMerge() {
        final Map<String, MicroserviceDto> result = new HashMap<>();
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

        final ConsumeDto consumeDto = new ConsumeDto();
        consumeDto.setLabel("labelConsume");
        consumeDto.setTarget("target");
        consumeDto.setType("type");
        dto1.getConsumes().add(consumeDto);

        final HostDto hostDto = new HostDto();
        hostDto.setHomePageUrl("homepageUrl");
        hostDto.setHostName("hostName");
        hostDto.setIpAddr("ipOfHost");
        hostDto.setPorts(Arrays.asList(80, 81));
        dto1.getHosts().add(hostDto);
        result.put(dto1.getId(), dto1);


        final MicroserviceDto dto2 = new MicroserviceDto();
        dto2.setId("id02");
        dto2.setIgnoredCommitters("ignoredCommiters2");
        dto2.setBitbucketUrl("bitbucketUrl2");
        dto2.setLabel("label2");
        dto2.setBuildMonitorLink("buidlMonitorLink2");
        result.put(dto2.getId(), dto2);


        return result;

    }


}