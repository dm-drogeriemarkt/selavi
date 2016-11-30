package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ServicePropertiesService;
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

    @RequestMapping
    public Collection<ObjectNode> readAllServices() {
        return servicePropertiesService.getServicesWithContent();
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.POST)
    public void addService(@PathVariable String serviceName, @RequestBody ObjectNode dto) {
        servicePropertiesService.createNewServiceInfo(serviceName, dto);
    }
}
