package de.filiadata.datahub.microservices.repository;

import de.filiadata.datahub.microservices.domain.ServiceProperties;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ServicePropertiesRepository extends CrudRepository<ServiceProperties, ServiceProperties.ServicePropertiesPk> {

    List<ServiceProperties> findByPkStage(String stage);
}
