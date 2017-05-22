package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.business.semanticexceptions.ServiceAddException;
import de.filiadata.datahub.microservices.business.semanticexceptions.ServiceDeleteException;
import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;

@Service
public class MicroserviceConditioningService {

    private final MicroserviceContentProviderService microserviceContentProviderService;
    private final MicroserviceDtoFactory microserviceDtoFactory;
    private final ServicePropertiesRepository servicePropertiesRepository;
    private final MicroserviceMergeService microserviceMergeService;

    public MicroserviceConditioningService(MicroserviceContentProviderService microserviceContentProviderService, MicroserviceDtoFactory microserviceDtoFactory, ServicePropertiesRepository servicePropertiesRepository, MicroserviceMergeService microserviceMergeService) {
        this.microserviceContentProviderService = microserviceContentProviderService;
        this.microserviceDtoFactory = microserviceDtoFactory;
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.microserviceMergeService = microserviceMergeService;
    }


    public Collection<MicroserviceDto> getAllMicroserviceDtos(String stage) {
        return microserviceContentProviderService.getAllMicroservices(stage).values();
    }

    public void addNewService(String stage, MicroserviceDto microserviceDto) {
        Assert.notNull(microserviceDto.getId());
        if (microserviceContentProviderService.getAllMicroservices(stage).get(microserviceDto.getId()) != null) {
            throw new ServiceAddException();
        }

        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), stage, microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));

    }

    public void updateService(String stage, MicroserviceDto clientDto) {
        final MicroserviceDto serverDto = microserviceContentProviderService.getMicroservicesFromPersistence(stage).get(clientDto.getId());
        if (serverDto != null) {
            clientDto.setConsumes(serverDto.getConsumes());
            clientDto.setHosts(serverDto.getHosts());
        }
        servicePropertiesRepository.save(new ServiceProperties(clientDto.getId(), stage, microserviceDtoFactory.getJsonFromMicroserviceDto(clientDto)));
    }

    public void deleteService(String stage, String serviceName) {
        Assert.notNull(serviceName);
        final ServiceProperties serviceProperties = servicePropertiesRepository.findOne(serviceName);
        if (serviceProperties == null) {
            throw new ServiceDeleteException();
        }

        final MicroserviceDto microserviceDtoFromJSON = microserviceDtoFactory.getMicroserviceDtoFromJSON(serviceProperties.getContent());
        if (!microserviceDtoFromJSON.isExternal()) {
            throw new ServiceDeleteException();

        }

        servicePropertiesRepository.delete(serviceProperties);

    }

    public void addNewRelation(String stage, String serviceName, ConsumeDto consumeDto) {
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(stage, serviceName);
        if (!microServiceHasConsumes(microserviceDto.getConsumes(), consumeDto)) {
            microserviceDto.getConsumes().add(consumeDto);
            servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), stage, microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
        }
    }


    public void editRelation(String stage, String serviceName, ConsumeDto consumeDto) {
        deleteRelation(stage, serviceName, consumeDto.getTarget());
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(stage, serviceName);
        microserviceDto.getConsumes().add(consumeDto);
        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), stage, microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
    }

    public void deleteRelation(String stage, String serviceName, String relatedServiceName) {
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(stage, serviceName);
        final Iterator<ConsumeDto> iter = microserviceDto.getConsumes().iterator();
        while (iter.hasNext()) {
            final ConsumeDto consumeDto = iter.next();
            if (consumeDto.getTarget().equals(relatedServiceName)) {
                iter.remove();
            }
        }

        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), stage, microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
    }


    private MicroserviceDto getMicroserviceDtoFromPersistenceOrCreateNew(final String stage, final String serviceName) {
        MicroserviceDto microserviceDto = microserviceContentProviderService.getMicroservicesFromPersistence(stage).get(serviceName);
        if (microserviceDto == null) {
            microserviceDto = new MicroserviceDto();
            microserviceDto.setId(serviceName);
            microserviceDto.setLabel(serviceName);
        }

        return microserviceDto;
    }

    private boolean microServiceHasConsumes(List<ConsumeDto> sourceDtos, ConsumeDto dtoToAdd) {
        if (sourceDtos == null || sourceDtos.isEmpty()) {
            return false;
        }
        for (final ConsumeDto sourceDto : sourceDtos) {
            if (sourceDto.getTarget().equals(dtoToAdd.getTarget())) {
                return true;
            }
        }

        return false;
    }

}
