package de.dm.personsearch;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class PersonSearchController {

    private final PersonRepository personRepository;

    public PersonSearchController(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @GetMapping("/person/search")
    public ResponseEntity<List<Person>> searchForPersons(@RequestParam String searchQuery) {
        return new ResponseEntity<>(this.personRepository.findByName(searchQuery), HttpStatus.OK);
    }
}
