package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.business.semanticexceptions.ServiceAddException;
import de.filiadata.datahub.microservices.business.semanticexceptions.ServiceDeleteException;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Collection;

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
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        if (serviceProperties == null) {
            throw new ServiceDeleteException();
        }

        final MicroserviceDto microserviceDtoFromJSON = microserviceDtoFactory.getMicroserviceDtoFromJSON(serviceProperties.getContent());
        if (!microserviceDtoFromJSON.isExternal()) {
            throw new ServiceDeleteException();

        }

        servicePropertiesRepository.delete(serviceProperties);

    }
}
