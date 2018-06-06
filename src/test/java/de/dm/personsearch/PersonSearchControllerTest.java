package de.dm.personsearch;

import org.junit.Before;
import org.junit.Test;

import javax.naming.InvalidNameException;
import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class PersonSearchControllerTest {

    private PersonSearchController personSearchController;

    private PersonRepository personRepository;

    @Before
    public void setup() {

        personRepository = mock(InMemoryPersonSearchService.class);
        personSearchController = new PersonSearchController(personRepository);
    }

    @Test
    public void getCurrentUser() throws InvalidNameException {
        Principal principal = () -> "foobar";
        Person user = Person.builder().build();

        when(personRepository.findByName("foobar")).thenReturn(Arrays.asList(user));

        Person result = personSearchController.searchForPersons("foobar").getBody().get(0);

        assertThat(result, is(user));
    }

    @Test
    public void getCurrentUserNoUniqueResult() throws InvalidNameException {
        Principal principal = () -> "foobar";

        when(personRepository.findByName("foobar")).thenReturn(Collections.emptyList());

        List<Person> result = personSearchController.searchForPersons("foobar").getBody();

        assertThat(result.size(), is(0));
    }

    @Test
    public void searchForPersons() throws Exception {
        Person person = mock(Person.class);
        String searchQuery = "gimmegimmegimmeapersonaftermidnight";
        when(personRepository.findByName(searchQuery)).thenReturn(Arrays.asList(person));

        List<Person> result = personSearchController.searchForPersons(searchQuery).getBody();

        assertThat(result.size(), is(1));
        assertThat(result.get(0), is(person));
    }
}
