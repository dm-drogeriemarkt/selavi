package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ServicePropertiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private ServicePropertiesService servicePropertiesService;

    @Autowired
    public ServiceController(ServicePropertiesService servicePropertiesService) {
        this.servicePropertiesService = servicePropertiesService;
    }

    @RequestMapping
    public Collection<ObjectNode> readAllServices() {
        return servicePropertiesService.getServicesWithContent();
    }

    @RequestMapping(method = RequestMethod.POST)
    public void addService(@RequestBody ObjectNode dto) {
        servicePropertiesService.createNewServiceInfo(dto);
    }

    @RequestMapping(value = "/{serviceName}/relation", method = RequestMethod.PUT)
    public void addRelation(@PathVariable String serviceName, @RequestBody String relatedServiceName) {
        servicePropertiesService.addRelation(serviceName, relatedServiceName);
    }

    @RequestMapping(value = "/{serviceName}/properties", method = RequestMethod.PUT)
    public void addProperty(@PathVariable String serviceName, @RequestBody Map<String, String> properties) {
        servicePropertiesService.addProperties(serviceName, properties);
    }

    // TODO: besser wäre: /{serviceName}/properties/{propertyName}
    @RequestMapping(value = "/{serviceName}/properties", method = RequestMethod.DELETE)
    public void deleteProperty(@PathVariable String serviceName, @RequestBody List<String> properyNames) {
        servicePropertiesService.deleteProperties(serviceName, properyNames);
    }
}
