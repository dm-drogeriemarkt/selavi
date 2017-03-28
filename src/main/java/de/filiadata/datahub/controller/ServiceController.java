package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ServicePropertiesService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private ServicePropertiesService servicePropertiesService;

    @Autowired
    public ServiceController(ServicePropertiesService servicePropertiesService) {
        this.servicePropertiesService = servicePropertiesService;
    }

    @ApiOperation(value = "Read all microservices from the registry and enrich them with saved additional properties from db.")
    @RequestMapping(method = RequestMethod.GET)
    public Collection<ObjectNode> readAllServices() {
        return servicePropertiesService.getServicesWithContent();
    }

    @ApiOperation(value = "Add a new service as node to add properties and relations to other services.")
    @RequestMapping(method = RequestMethod.POST)
    public void addService(@RequestBody ObjectNode dto) {
        servicePropertiesService.createNewServiceInfo(dto);
    }

    @ApiOperation(value = "Delete a service node. Only manually added and not from the registry loaded are allowed to delete.")
    @RequestMapping(value = "/{serviceName}", method = RequestMethod.DELETE)
    public void deleteService(@PathVariable String serviceName) {
        servicePropertiesService.deleteService(serviceName);
    }

    @ApiOperation(value = "Add a new relation between two services.")
    @RequestMapping(value = "/{serviceName}/relations", method = RequestMethod.POST)
    public void addNewRelation(@PathVariable String serviceName, @RequestBody ObjectNode consumedService) {
        servicePropertiesService.addRelation(serviceName, consumedService);
    }

    @ApiOperation(value = "Delete a relation between two services. If the last relation ist removed, the 'consumes' property will also removed.")
    @RequestMapping(value = "/{serviceName}/relations/{relatedServiceName}", method = RequestMethod.DELETE)
    public void deleteRelation(@PathVariable String serviceName, @PathVariable String relatedServiceName) {
        servicePropertiesService.deleteRelation(serviceName, relatedServiceName);
    }

    @ApiOperation(value = "Add a new property or update an existing. Properties internal properties are not allowed to be set.")
    @RequestMapping(value = "/{serviceName}/properties", method = RequestMethod.PUT)
    public void addProperty(@PathVariable String serviceName, @RequestBody ObjectNode property) {
        servicePropertiesService.addProperties(serviceName, property);
    }

    @ApiOperation(value = "Remove a property from the specific service.")
    @RequestMapping(value = "/{serviceName}/properties/{propertyName}", method = RequestMethod.DELETE)
    public void deleteProperty(@PathVariable String serviceName, @PathVariable String propertyName) {
        servicePropertiesService.deleteProperty(serviceName, propertyName);
    }
}
