package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.business.semanticexceptions.ServiceAddException;
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

    public MicroserviceConditioningService(MicroserviceContentProviderService microserviceContentProviderService, MicroserviceDtoFactory microserviceDtoFactory, ServicePropertiesRepository servicePropertiesRepository) {
        this.microserviceContentProviderService = microserviceContentProviderService;
        this.microserviceDtoFactory = microserviceDtoFactory;
        this.servicePropertiesRepository = servicePropertiesRepository;
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
}
