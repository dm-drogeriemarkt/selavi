package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.repository.ServiceRegistryRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MicroserviceContentProviderService {

    private final ServiceRegistryRepository serviceRegistryRepository;
    private final PersistenceContentProvider persistenceContentProvider;
    private final MicroserviceMergeService microserviceMergeService;

    public MicroserviceContentProviderService(ServiceRegistryRepository serviceRegistryRepository, PersistenceContentProvider persistenceContentProvider, MicroserviceMergeService microserviceMergeService) {
        this.serviceRegistryRepository = serviceRegistryRepository;
        this.persistenceContentProvider = persistenceContentProvider;
        this.microserviceMergeService = microserviceMergeService;
    }

    public Map<String, MicroserviceDto> getAllMicroservices(){
        final Map<String, MicroserviceDto> microservicesFromRegistry = serviceRegistryRepository.findAllServices();
        final Map<String, MicroserviceDto> microservicesFromPersistence = persistenceContentProvider.getAllMicroservices();


        return microserviceMergeService.mergeCompleteMicroservices(microservicesFromRegistry, microservicesFromPersistence);
    }
}
