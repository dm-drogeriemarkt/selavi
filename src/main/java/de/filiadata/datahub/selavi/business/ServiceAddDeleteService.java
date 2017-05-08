package de.filiadata.datahub.selavi.business;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.selavi.business.semanticexceptions.ServiceAddException;
import de.filiadata.datahub.selavi.business.semanticexceptions.ServiceDeleteException;
import de.filiadata.datahub.selavi.domain.ServiceProperties;
import de.filiadata.datahub.selavi.repository.ServicePropertiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ServiceAddDeleteService {

    private static final String FIELDNAME_IS_EXTERNAL = "isExternal";
    private ServicePropertiesRepository servicePropertiesRepository;
    private DefaultNodeContentFactory defaultNodeContentFactory;

    @Autowired
    public ServiceAddDeleteService(ServicePropertiesRepository servicePropertiesRepository, DefaultNodeContentFactory defaultNodeContentFactory) {
        this.servicePropertiesRepository = servicePropertiesRepository;
        this.defaultNodeContentFactory = defaultNodeContentFactory;
    }

    public void createNewServiceInfo(ObjectNode dto) {
        String serviceName = dto.get("id").textValue();
        if (servicePropertiesRepository.exists(serviceName)) {
            throw new ServiceAddException();
        }
        servicePropertiesRepository.save(new ServiceProperties(serviceName, dto.toString()));
    }

    public void deleteService(String serviceName) {
        final ServiceProperties serviceProperties = servicePropertiesRepository.findById(serviceName);
        if (serviceProperties == null) {
            throw new ServiceDeleteException();
        }

        try {
            ObjectNode node = (ObjectNode) defaultNodeContentFactory.getMapper().readTree(serviceProperties.getContent());
            if (!node.hasNonNull(FIELDNAME_IS_EXTERNAL)) {
                throw new ServiceDeleteException();
            }

            servicePropertiesRepository.delete(serviceProperties);
        } catch (IOException e) {
            throw new ServiceDeleteException(e);
        }
    }
}
