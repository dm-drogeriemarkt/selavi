package de.filiadata.datahub.common;

import com.sun.security.auth.LdapPrincipal;
import de.filiadata.datahub.activedirectory.business.ActiveDirectoryService;
import de.filiadata.datahub.activedirectory.domain.Person;
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

    private ActiveDirectoryService activeDirectoryService;

    @Before
    public void setup() {
        activeDirectoryService = mock(ActiveDirectoryService.class);

        userController = new UserController(activeDirectoryService);
    }

    @Test
    public void getUserDetails() throws InvalidNameException {

        Principal principal = () -> "foobar";

        Person user = Person.builder().build();
        when(activeDirectoryService.getAllPersonNames("foobar")).thenReturn(Arrays.asList(user));

        Person result = userController.getUserDetails(principal);

        assertThat(result, is(user));
    }

    @Test
    public void getUserDetailsNoUniqueResult() throws InvalidNameException {

        Principal principal = () -> "foobar";

        when(activeDirectoryService.getAllPersonNames("foobar")).thenReturn(Collections.emptyList());

        Person result = userController.getUserDetails(principal);

        assertThat(result.getDisplayName(), is("foobar"));
    }
}