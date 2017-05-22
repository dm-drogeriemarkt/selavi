package de.filiadata.datahub.microservices.controller;

import de.filiadata.datahub.microservices.business.MicroserviceConditioningService;
import de.filiadata.datahub.microservices.business.ServiceRegistryContentProvider;
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
    private final ServiceRegistryContentProvider serviceRegistryContentProvider;

    @Autowired
    public ServiceController(MicroserviceConditioningService microserviceConditioningService, ServiceRegistryContentProvider serviceRegistryContentProvider) {
        this.microserviceConditioningService = microserviceConditioningService;
        this.serviceRegistryContentProvider = serviceRegistryContentProvider;
    }

    @ApiOperation(value = "Get the names of all available deployment stages (eg, 'dev', 'rls', 'prod', ...)")
    @RequestMapping(value = "/stages", method = RequestMethod.GET)
    public Collection<String> getAllStageNames() {
        return serviceRegistryContentProvider.getAllStageNames();
    }

    @ApiOperation(value = "Read all microservices from the specified stage of the registry and enrich them with saved additional properties from db.")
    @RequestMapping(value = "/{stage}", method = RequestMethod.GET)
    public Collection<MicroserviceDto> readAllServices(@PathVariable String stage) {
        return microserviceConditioningService.getAllMicroserviceDtos();
    }

    @ApiOperation(value = "Add a new service as node to add properties and relations to other services.")
    @RequestMapping(value = "/{stage}", method = RequestMethod.POST)
    public void addNewService(@PathVariable String stage, @RequestBody MicroserviceDto dto) {
        microserviceConditioningService.addNewService(stage, dto);
    }

    @ApiOperation(value = "Add a new property or update an existing. Properties internal properties are not allowed to be set.")
    @RequestMapping(value = "/{stage}/{serviceName}/properties", method = RequestMethod.PUT)
    public void updateService(@PathVariable String stage, @PathVariable String serviceName, @RequestBody MicroserviceDto dto) {
        microserviceConditioningService.updateService(stage, dto);
    }


    @ApiOperation(value = "Delete a service node. Only manually added and not from the registry loaded are allowed to delete.")
    @RequestMapping(value = "/{stage}/{serviceName}", method = RequestMethod.DELETE)
    public void deleteService(@PathVariable String stage, @PathVariable String serviceName) {
        microserviceConditioningService.deleteService(stage, serviceName);
    }

    @ApiOperation(value = "Add a new relation between two services.")
    @RequestMapping(value = "/{stage}/{serviceName}/relations", method = RequestMethod.POST)
    public void addNewRelation(@PathVariable String stage, @PathVariable String serviceName, @RequestBody ConsumeDto consumeDto) {
        microserviceConditioningService.addNewRelation(stage, serviceName, consumeDto);
    }

    @ApiOperation(value = "Delete a relation between two services. If the last relation ist removed, the 'consumes' property will also removed.")
    @RequestMapping(value = "/{stage}/{serviceName}/relations/{relatedServiceName}", method = RequestMethod.DELETE)
    public void deleteRelation(@PathVariable String stage, @PathVariable String serviceName, @PathVariable String relatedServiceName) {
        microserviceConditioningService.deleteRelation(stage, serviceName, relatedServiceName);
    }

    @ApiOperation(value = "Edit a relation between two services.")
    @RequestMapping(value = "/{serviceName}/relations/{consumeDto}", method = RequestMethod.PUT)
    public void editRelation(@PathVariable String stage, @PathVariable String serviceName, @RequestBody ConsumeDto consumeDto) {
        microserviceConditioningService.editRelation(stage, serviceName, consumeDto);
    }
}
