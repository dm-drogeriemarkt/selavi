package de.filiadata.datahub.microservices.repository;

import de.filiadata.datahub.microservices.domain.ServiceProperties;
import org.springframework.data.repository.CrudRepository;

public interface ServicePropertiesRepository extends CrudRepository<ServiceProperties, String> {

}
