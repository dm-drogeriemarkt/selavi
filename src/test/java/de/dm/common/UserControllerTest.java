package de.dm.common;

import de.dm.personsearch.Person;
import de.dm.personsearch.PersonRepository;
import org.junit.Before;
import org.junit.Test;

import javax.naming.InvalidNameException;
import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserControllerTest {

    private UserController userController;

    private PersonRepository activeDirectoryService;

    @Before
    public void setup() {
        activeDirectoryService = mock(PersonRepository.class);

        userController = new UserController(activeDirectoryService);
    }

    @Test
    public void getUserDetails() throws InvalidNameException {

        Principal principal = () -> "foobar";
        Person user = Person.builder().build();

        when(activeDirectoryService.findByName("foobar")).thenReturn(Arrays.asList(user));

        Person result = userController.getUserDetails(principal);

        assertThat(result, is(user));
    }

    @Test
    public void getUserDetailsNoUniqueResult() throws InvalidNameException {

        Principal principal = () -> "foobar";

        when(activeDirectoryService.findByName("foobar")).thenReturn(Collections.emptyList());

        Person result = userController.getUserDetails(principal);

        assertThat(result.getDisplayName(), is("foobar"));
    }
}
