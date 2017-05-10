package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class MicroserviceConditioningService {

    private final MicroserviceContentProviderService microserviceContentProviderService;

    public MicroserviceConditioningService(MicroserviceContentProviderService microserviceContentProviderService) {
        this.microserviceContentProviderService = microserviceContentProviderService;
    }


    public Collection<MicroserviceDto> getAllMicroserviceDtos() {
        return microserviceContentProviderService.getAllMicroservices().values();
    }
}
