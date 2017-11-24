package de.dm.microservices.repository;

import de.dm.microservices.domain.ServiceProperties;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ServicePropertiesRepository extends CrudRepository<ServiceProperties, ServiceProperties.ServicePropertiesPk> {

    List<ServiceProperties> findByPkStage(String stage);
}
