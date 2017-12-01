package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryService;
import de.dm.activedirectory.domain.Person;
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

        List<Person> personList = activeDirectoryService.findPersonsByName(principal.getName());
        if (personList.size() == 1) {
            return personList.get(0);
        }

        return Person.builder().displayName(principal.getName()).build();
    }
}
