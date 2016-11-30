package de.filiadata.datahub.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.filiadata.datahub.business.ConsumerRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/consumer")
public class ConsumerRelationController {

    private ConsumerRelationService consumerRelationService;

    @Autowired
    public ConsumerRelationController(ConsumerRelationService consumerRelationService) {
        this.consumerRelationService = consumerRelationService;
    }

    @RequestMapping
    public Collection<ObjectNode> readConsumer() {
        return consumerRelationService.getConsumerRelations();
    }

    @RequestMapping(value = "/{serviceName}", method = RequestMethod.POST)
    public void updateConsumer(@PathVariable String serviceName, @RequestBody List<String> consumedServiceId) {
        consumerRelationService.createNewConsumerRelation(serviceName, consumedServiceId);
    }
}
