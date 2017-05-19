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


    public Collection<MicroserviceDto> getAllMicroserviceDtos() {
        return microserviceContentProviderService.getAllMicroservices().values();
    }

    public void addNewService(MicroserviceDto microserviceDto) {
        Assert.notNull(microserviceDto.getId());
        if (microserviceContentProviderService.getAllMicroservices().get(microserviceDto.getId()) != null) {
            throw new ServiceAddException();
        }

        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));

    }

    public void updateService(MicroserviceDto clientDto) {
        final MicroserviceDto serverDto = microserviceContentProviderService.getMicroservicesFromPersistence().get(clientDto.getId());
        if (serverDto != null) {
            clientDto.setConsumes(serverDto.getConsumes());
            clientDto.setHosts(serverDto.getHosts());
        }
        servicePropertiesRepository.save(new ServiceProperties(clientDto.getId(), microserviceDtoFactory.getJsonFromMicroserviceDto(clientDto)));
    }

    public void deleteService(String serviceName) {
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

    public void addNewRelation(String serviceName, ConsumeDto consumeDto) {
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(serviceName);
        if (!microServiceHasConsumes(microserviceDto.getConsumes(), consumeDto)) {
            microserviceDto.getConsumes().add(consumeDto);
            servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
        }
    }


    public void editRelation(String serviceName, ConsumeDto consumeDto) {
        deleteRelation(serviceName, consumeDto.getTarget());
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(serviceName);
        microserviceDto.getConsumes().add(consumeDto);
        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
    }

    public void deleteRelation(String serviceName, String relatedServiceName) {
        final MicroserviceDto microserviceDto = getMicroserviceDtoFromPersistenceOrCreateNew(serviceName);
        final Iterator<ConsumeDto> iter = microserviceDto.getConsumes().iterator();
        while (iter.hasNext()) {
            final ConsumeDto consumeDto = iter.next();
            if (consumeDto.getTarget().equals(relatedServiceName)) {
                iter.remove();
            }
        }

        servicePropertiesRepository.save(new ServiceProperties(microserviceDto.getId(), microserviceDtoFactory.getJsonFromMicroserviceDto(microserviceDto)));
    }


    private MicroserviceDto getMicroserviceDtoFromPersistenceOrCreateNew(final String serviceName) {
        MicroserviceDto microserviceDto = microserviceContentProviderService.getMicroservicesFromPersistence().get(serviceName);
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
