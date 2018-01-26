package de.dm.common;

import de.dm.selavi.personrepositorycore.Person;
import de.dm.selavi.personrepositorycore.PersonRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
public class UserController {

    private final PersonRepository personRepository;

    public UserController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @RequestMapping("/user")
    public Person getUserDetails(Principal principal) {

        List<Person> personList = personRepository.findByName(principal.getName());
        if (personList.size() == 1) {
            return personList.get(0);
        }

        return Person.builder().displayName(principal.getName()).build();
    }
}
