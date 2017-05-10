package de.filiadata.datahub.microservices.controller;

import de.filiadata.datahub.microservices.business.MicroserviceConditioningService;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/services")
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

    @ApiOperation(value = "Add a new service as node to add properties and relations to other services.")
    @RequestMapping(method = RequestMethod.POST)
    public void addNewService(@RequestBody MicroserviceDto dto) {
        microserviceConditioningService.addNewService(dto);
    }

    @ApiOperation(value = "Add a new property or update an existing. Properties internal properties are not allowed to be set.")
    @RequestMapping(value = "/{serviceName}/properties", method = RequestMethod.PUT)
    public void updateService(@PathVariable String serviceName, @RequestBody MicroserviceDto dto) {
        microserviceConditioningService.updateService(dto);
    }


    @ApiOperation(value = "Delete a service node. Only manually added and not from the registry loaded are allowed to delete.")
    @RequestMapping(value = "/{serviceName}", method = RequestMethod.DELETE)
    public void deleteService(@PathVariable String serviceName) {
        microserviceConditioningService.deleteService(serviceName);
    }

}
