package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.repository.ServiceRegistryRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MicroserviceContentProviderService {

    private final ServiceRegistryRepository serviceRegistryRepository;

    public MicroserviceContentProviderService(ServiceRegistryRepository serviceRegistryRepository) {
        this.serviceRegistryRepository = serviceRegistryRepository;
    }

    public Map<String, MicroserviceDto> getAllMicroservices(){
        return serviceRegistryRepository.findAllServices();
    }
}
