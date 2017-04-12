package de.filiadata.datahub.controller;

import de.filiadata.datahub.business.activedirectory.ActiveDirectoryService;
import de.filiadata.datahub.business.activedirectory.Person;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class PersonSearchController {

    private final ActiveDirectoryService activeDirectoryService;

    public PersonSearchController(ActiveDirectoryService activeDirectoryService) {
        this.activeDirectoryService = activeDirectoryService;
    }

    @GetMapping("/person/search")
    public ResponseEntity<List<Person>> serachForPersons(@RequestParam String searchQuery) {
        return new ResponseEntity<>(this.activeDirectoryService.getAllPersonNames(searchQuery), HttpStatus.OK);
    }
}
