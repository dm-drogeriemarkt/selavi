package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MicroserviceMergeService {

    public Map<String, MicroserviceDto> mergeCompleteMicroservices(final Map<String, MicroserviceDto> microservicesFromRegistry, final Map<String, MicroserviceDto> microservicesFromPersistence){
        final Map<String, MicroserviceDto> result = new HashMap<>();
        for (final MicroserviceDto microserviceFromRegistry : microservicesFromRegistry.values()){
            final MicroserviceDto dto = mergeMicroservice(new MicroserviceDto(), microserviceFromRegistry);
            result.put(dto.getId(), mergeMicroservice(dto, microservicesFromPersistence.get(microserviceFromRegistry.getId())));
        }
        for (final MicroserviceDto microserviceFromPersistence : microservicesFromPersistence.values()){
            if (microservicesFromRegistry.get(microserviceFromPersistence.getId()) == null){
                result.put(microserviceFromPersistence.getId(), mergeMicroservice(new MicroserviceDto(), microservicesFromPersistence.get(microserviceFromPersistence.getId())));
            }
        }

        return result;
    }

    public MicroserviceDto mergeMicroservice(MicroserviceDto sourceService, MicroserviceDto serviceToMerge) {
        Assert.notNull(sourceService);

        if (serviceToMerge == null){
            return sourceService;
        }

        sourceService.setId(serviceToMerge.getId());

        if (StringUtils.isNotEmpty(serviceToMerge.getLabel())){
            sourceService.setLabel(serviceToMerge.getLabel());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getDescription())){
            sourceService.setDescription(serviceToMerge.getDescription());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getBitbucketUrl())){
            sourceService.setBitbucketUrl(serviceToMerge.getBitbucketUrl());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getIgnoredCommitters())){
            sourceService.setIgnoredCommitters(serviceToMerge.getIgnoredCommitters());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getFdOwner())){
            sourceService.setFdOwner(serviceToMerge.getFdOwner());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getTags())){
            sourceService.setTags(serviceToMerge.getTags());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getMicroserviceUrl())){
            sourceService.setMicroserviceUrl(serviceToMerge.getMicroserviceUrl());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getIpAddress())){
            sourceService.setIpAddress(serviceToMerge.getIpAddress());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getNetworkZone())){
            sourceService.setNetworkZone(serviceToMerge.getNetworkZone());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getDocumentationLink())){
            sourceService.setDocumentationLink(serviceToMerge.getDocumentationLink());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getBuildMonitorLink())){
            sourceService.setBuildMonitorLink(serviceToMerge.getBuildMonitorLink());
        }

        if (StringUtils.isNotEmpty(serviceToMerge.getMonitoringLink())){
            sourceService.setMonitoringLink(serviceToMerge.getMonitoringLink());
        }
        if (serviceToMerge.isExternal()) {
            sourceService.setExternal(true);
        }

        mergeHosts(sourceService, serviceToMerge);
        mergeConsumes(sourceService.getConsumes(), serviceToMerge.getConsumes());

        return sourceService;
    }

    private void mergeConsumes(final List<ConsumeDto> consumes, final List<ConsumeDto> consumesToMerge) {
        if (consumesToMerge != null) {
            final Map<String, ConsumeDto> consumeDtoMap = consumesToMerge.stream().collect(Collectors.toMap(ConsumeDto::getTarget, consumeDto -> consumeDto));
            final Iterator<ConsumeDto> iter = consumes.iterator();
            while (iter.hasNext()) {
                final ConsumeDto consumeDto = iter.next();
                if (consumeDtoMap.get(consumeDto.getTarget()) != null) {
                    iter.remove();
                }
            }
            consumes.addAll(consumesToMerge);
        }
    }


    private void mergeHosts(MicroserviceDto sourceService, MicroserviceDto serviceToMerge) {
        if (serviceToMerge.getHosts() != null && !serviceToMerge.getHosts().isEmpty()){
            sourceService.setHosts(serviceToMerge.getHosts());
        }
    }
}
