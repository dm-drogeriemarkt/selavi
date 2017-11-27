package de.dm.microservices.business;

import de.dm.microservices.domain.MicroserviceDto;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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

    public Map<String, MicroserviceDto> getAllMicroservices(String stage) {
        final Map<String, MicroserviceDto> microservicesFromRegistry = getMicroservicesFromServiceRegistry(stage);
        final Map<String, MicroserviceDto> microservicesFromPersistence = getMicroservicesFromPersistence(stage);

        return mergeMicroserviceLists(microservicesFromRegistry, microservicesFromPersistence);
    }

    Map<String, MicroserviceDto> getMicroservicesFromPersistence(String stage) {
        return persistenceContentProvider.getAllMicroservices(stage);
    }

    Map<String, MicroserviceDto> getMicroservicesFromServiceRegistry(String stage) {
        return serviceRegistryContentProvider.getAllMicroservices(stage);
    }

    private Map<String, MicroserviceDto> mergeMicroserviceLists(final Map<String, MicroserviceDto> microservicesFromRegistry, final Map<String, MicroserviceDto> microservicesFromPersistence) {
        final Map<String, MicroserviceDto> mergedDtoList = new HashMap<>();
        mergedDtoList.putAll(extractRegisteredButNotPersisted(microservicesFromRegistry, microservicesFromPersistence));
        mergedDtoList.putAll(extractPersistedButNotRegistered(microservicesFromRegistry, microservicesFromPersistence));
        mergedDtoList.putAll(mergeBothRegisteredAndPersisted(microservicesFromRegistry, microservicesFromPersistence));
        return mergedDtoList;
    }

    private Map<String, MicroserviceDto> mergeBothRegisteredAndPersisted(Map<String, MicroserviceDto> microservicesFromRegistry, Map<String, MicroserviceDto> microservicesFromPersistence) {
        return microservicesFromRegistry.values()
                .stream()
                .filter(dto -> microservicesFromPersistence.containsKey(dto.getId()))
                .map(dto ->
                        microserviceMergeService.merge(dto, microservicesFromPersistence.get(dto.getId()))).collect(Collectors.toMap(MicroserviceDto::getId, Function.identity()));
    }

    private Map<String, MicroserviceDto> extractPersistedButNotRegistered(Map<String, MicroserviceDto> microservicesFromRegistry, Map<String, MicroserviceDto> microservicesFromPersistence) {
        return microservicesFromPersistence.values()
                .stream()
                .filter(dto -> !microservicesFromRegistry.containsKey(dto.getId()))
                .collect(Collectors.toMap(MicroserviceDto::getId, Function.identity()));
    }

    private Map<String, MicroserviceDto> extractRegisteredButNotPersisted(Map<String, MicroserviceDto> microservicesFromRegistry, Map<String, MicroserviceDto> microservicesFromPersistence) {
        return microservicesFromRegistry.values()
                .stream()
                .filter(dto -> !microservicesFromPersistence.containsKey(dto.getId()))
                .collect(Collectors.toMap(MicroserviceDto::getId, Function.identity()));
    }
}
