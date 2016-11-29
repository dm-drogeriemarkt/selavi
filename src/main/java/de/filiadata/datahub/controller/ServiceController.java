package de.filiadata.datahub.controller;

import de.filiadata.datahub.business.MicroserviceReaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ServiceController {

    private MicroserviceReaderService microserviceReaderService;

    @Autowired
    public ServiceController(MicroserviceReaderService microserviceReaderService) {
        this.microserviceReaderService = microserviceReaderService;
    }

    @RequestMapping("/services")
    public Map<String, String> readServiceNames() {
        return microserviceReaderService.readServices();
    }
}
