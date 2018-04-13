package de.dm.activedirectory.client.rest;

import de.dm.activedirectory.business.ActiveDirectoryService;
import de.dm.activedirectory.domain.Person;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

@Controller
public class PersonSearchController {

    private final ActiveDirectoryService activeDirectoryService;

    public PersonSearchController(ActiveDirectoryService activeDirectoryService) {
        this.activeDirectoryService = activeDirectoryService;
    }

    @RequestMapping(value = "/person/search", method = RequestMethod.GET)
    public List<Person> searchForPersons(@RequestParam String searchQuery) {
        return this.activeDirectoryService.findPersonsByName(searchQuery);
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public Person getCurrentUser(Principal principal) {

        List<Person> personList = activeDirectoryService.findPersonsByName(principal.getName());
        if (personList.size() == 1) {
            return personList.get(0);
        }

        return Person.builder().displayName(principal.getName()).build();
    }
}
