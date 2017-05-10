package de.filiadata.datahub.microservices.controller;

import de.filiadata.datahub.microservices.business.MicroserviceConditioningService;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/test-services")
public class ServiceTestController {

    private final MicroserviceConditioningService microserviceConditioningService;

    @Autowired
    public ServiceTestController(MicroserviceConditioningService microserviceConditioningService) {
        this.microserviceConditioningService = microserviceConditioningService;
    }

    @ApiOperation(value = "Read all microservices from the registry and enrich them with saved additional properties from db.")
    @RequestMapping(method = RequestMethod.GET)
    public Collection<MicroserviceDto> readAllServices() {
        return microserviceConditioningService.getAllMicroserviceDtos();
    }

}
