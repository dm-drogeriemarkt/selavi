package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MicroserviceContentProviderService {

    private final ServiceRegistryContentProvider serviceRegistryContentProvider;
    private final PersistenceContentProvider persistenceContentProvider;
    private final MicroserviceMergeService microserviceMergeService;

    public MicroserviceContentProviderService(ServiceRegistryContentProvider serviceRegistryContentProvider, PersistenceContentProvider persistenceContentProvider, MicroserviceMergeService microserviceMergeService) {
        this.serviceRegistryContentProvider = serviceRegistryContentProvider;
        this.persistenceContentProvider = persistenceContentProvider;
        this.microserviceMergeService = microserviceMergeService;
    }

    public Map<String, MicroserviceDto> getAllMicroservices(String stage){
        final Map<String, MicroserviceDto> microservicesFromRegistry = getMicroservicesFromServiceRegistry(stage);
        final Map<String, MicroserviceDto> microservicesFromPersistence = getMicroservicesFromPersistence(stage);


        return microserviceMergeService.mergeCompleteMicroservices(microservicesFromRegistry, microservicesFromPersistence);
    }

    public Map<String, MicroserviceDto> getMicroservicesFromPersistence(String stage){
        return persistenceContentProvider.getAllMicroservices(stage);
    }

    public Map<String, MicroserviceDto> getMicroservicesFromServiceRegistry(String stage){
        return serviceRegistryContentProvider.getAllMicroservices(stage);
    }
}
