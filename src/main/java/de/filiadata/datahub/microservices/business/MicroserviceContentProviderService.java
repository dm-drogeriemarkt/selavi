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

    public Map<String, MicroserviceDto> getAllMicroservices(){
        final Map<String, MicroserviceDto> microservicesFromRegistry = getMicroservicesFromServiceRegistry();
        final Map<String, MicroserviceDto> microservicesFromPersistence = getMicroservicesFromPersistence();


        return microserviceMergeService.mergeCompleteMicroservices(microservicesFromRegistry, microservicesFromPersistence);
    }

    public Map<String, MicroserviceDto> getMicroservicesFromPersistence(){
        return persistenceContentProvider.getAllMicroservices();
    }

    public Map<String, MicroserviceDto> getMicroservicesFromServiceRegistry(){
        return serviceRegistryContentProvider.getAllMicroservices();
    }
}
