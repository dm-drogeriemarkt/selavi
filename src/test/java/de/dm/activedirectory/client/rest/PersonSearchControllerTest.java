package de.dm.activedirectory.client.rest;

import de.dm.activedirectory.business.ActiveDirectoryService;
import de.dm.activedirectory.domain.Person;
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

    private ActiveDirectoryService activeDirectoryService;

    @Before
    public void setup() {
        activeDirectoryService = mock(ActiveDirectoryService.class);
        personSearchController = new PersonSearchController(activeDirectoryService);
    }

    @Test
    public void getCurrentUser() throws InvalidNameException {
        Principal principal = () -> "foobar";
        Person user = Person.builder().build();
        when(activeDirectoryService.findPersonsByName("foobar")).thenReturn(Arrays.asList(user));

        Person result = personSearchController.getCurrentUser(principal);

        assertThat(result, is(user));
    }

    @Test
    public void getCurrentUserNoUniqueResult() throws InvalidNameException {
        Principal principal = () -> "foobar";
        when(activeDirectoryService.findPersonsByName("foobar")).thenReturn(Collections.emptyList());

        Person result = personSearchController.getCurrentUser(principal);

        assertThat(result.getDisplayName(), is("foobar"));
    }

    @Test
    public void searchForPersons() throws Exception {
        Person person = mock(Person.class);
        String searchQuery = "gimmegimmegimmeapersonaftermidnight";
        when(activeDirectoryService.findPersonsByName(searchQuery)).thenReturn(Arrays.asList(person));

        List<Person> result = personSearchController.searchForPersons(searchQuery);

        assertThat(result.size(), is(1));
        assertThat(result.get(0), is(person));
    }
}
