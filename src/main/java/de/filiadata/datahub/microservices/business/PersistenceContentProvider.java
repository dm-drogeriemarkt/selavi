package de.filiadata.datahub.microservices.business;

import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import de.filiadata.datahub.microservices.domain.ServiceProperties;
import de.filiadata.datahub.microservices.repository.ServicePropertiesRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PersistenceContentProvider {

    private final ServicePropertiesRepository servicePropertiesRepository;
    private final MicroserviceDtoFactory microserviceDtoFactory;

    public PersistenceContentProvider(ServicePropertiesRepository servicePropertiesRepository, MicroserviceDtoFactory microserviceDtoFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.microserviceDtoFactory = microserviceDtoFactory;
    }

    public Map<String, MicroserviceDto> getAllMicroservices() {
        final Map<String, MicroserviceDto> microserviceDtoMap = new HashMap<>();
        final Iterable<ServiceProperties> allServiceProperties = servicePropertiesRepository.findAll();
        allServiceProperties.forEach(serviceProperties -> {
            final MicroserviceDto microserviceDto = microserviceDtoFactory.getMicroserviceDtoFromJSON(serviceProperties.getContent());
            if (microserviceDto != null){
                microserviceDtoMap.put(serviceProperties.getId(), microserviceDto);
            }
        });

        return microserviceDtoMap;
    }

}
