package de.filiadata.datahub.selavi.repository;

import de.filiadata.datahub.selavi.domain.ServiceProperties;
import org.springframework.data.repository.CrudRepository;

public interface ServicePropertiesRepository extends CrudRepository<ServiceProperties, String> {

    ServiceProperties findById(String id);

}
