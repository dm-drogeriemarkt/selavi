package de.filiadata.datahub.controller;

import de.filiadata.datahub.business.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private ContentService contentService;

    @Autowired
    public ServiceController(ContentService contentService) {
        this.contentService = contentService;

    }

    @RequestMapping
    public Collection<ContentDto> readServiceNames() {
        final Map<String, ContentDto> servicesWithContent = contentService.getServicesWithContent();
        return servicesWithContent.values();
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.POST)
    public void addProperty(@PathVariable String serviceName, ContentDto dto) {
        // TODO
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.PUT)
    public void updateProperty(@PathVariable String serviceName, ContentDto dto) {
        // TODO
    }
}
