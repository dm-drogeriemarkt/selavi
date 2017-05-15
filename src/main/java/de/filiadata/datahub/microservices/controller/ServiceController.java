package de.filiadata.datahub.microservices.controller;

import de.filiadata.datahub.microservices.business.MicroserviceConditioningService;
import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final MicroserviceConditioningService microserviceConditioningService;

    @Autowired
    public ServiceController(MicroserviceConditioningService microserviceConditioningService) {
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

    @ApiOperation(value = "Add a new relation between two services.")
    @RequestMapping(value = "/{serviceName}/relations", method = RequestMethod.POST)
    public void addNewRelation(@PathVariable String serviceName, @RequestBody ConsumeDto consumeDto) {
        microserviceConditioningService.addNewRelation(serviceName, consumeDto);
    }

    @ApiOperation(value = "Delete a relation between two services. If the last relation ist removed, the 'consumes' property will also removed.")
    @RequestMapping(value = "/{serviceName}/relations/{relatedServiceName}", method = RequestMethod.DELETE)
    public void deleteRelation(@PathVariable String serviceName, @PathVariable String relatedServiceName) {
        microserviceConditioningService.deleteRelation(serviceName, relatedServiceName);
    }

    @ApiOperation(value = "Edit a relation between two services.")
    @RequestMapping(value = "/{serviceName}/relations/{consumeDto}", method = RequestMethod.PUT)
    public void editRelation(@PathVariable String serviceName, @RequestBody ConsumeDto consumeDto) {
        microserviceConditioningService.editRelation(serviceName, consumeDto);
    }
}
