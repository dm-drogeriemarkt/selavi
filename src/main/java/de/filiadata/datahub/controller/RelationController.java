package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ServiceConsumerRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/consumer")
public class RelationController {

    private ServiceConsumerRelationService serviceConsumerRelationService;

    @Autowired
    public RelationController(ServiceConsumerRelationService serviceConsumerRelationService) {
        this.serviceConsumerRelationService = serviceConsumerRelationService;
    }

    @RequestMapping
    public Collection<ObjectNode> readConsumer() {
        return serviceConsumerRelationService.getConsumerRelations();
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.POST)
    public void updateConsumer(@PathVariable String serviceName, @RequestBody List<String> consumedServiceId) {
        serviceConsumerRelationService.createNewConsumerRelation(serviceName, consumedServiceId);
    }
}
