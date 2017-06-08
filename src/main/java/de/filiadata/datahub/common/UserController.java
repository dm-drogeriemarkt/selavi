package de.filiadata.datahub.common;

import de.filiadata.datahub.activedirectory.business.ActiveDirectoryService;
import de.filiadata.datahub.activedirectory.domain.Person;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
public class UserController {

    private final ActiveDirectoryService activeDirectoryService;

    public UserController(ActiveDirectoryService activeDirectoryService) {
        this.activeDirectoryService = activeDirectoryService;
    }

    @RequestMapping("/user")
    public Person getUserDetails(Principal principal) {

        List<Person> personList = activeDirectoryService.getAllPersonNames(principal.getName());
        if (personList.size() == 1) {
            return personList.get(0);
        }

        return Person.builder().displayName(principal.getName()).build();
    }
}
