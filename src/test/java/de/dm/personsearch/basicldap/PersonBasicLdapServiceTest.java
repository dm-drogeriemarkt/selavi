package de.dm.personsearch.basicldap;

import de.dm.personsearch.Person;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.ContainerCriteria;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PersonBasicLdapServiceTest {

    private PersonBasicLdapService personBasicLdapService;

    @Mock
    private LdapTemplate ldapTemplate;

    @Before
    public void init() {
        personBasicLdapService = new PersonBasicLdapService(ldapTemplate);
    }

    @Test
    public void findByName() {
        final List<Person> persons = Arrays.asList(Person.builder().id("testId").displayName("bob").eMail("bob@bob.de").build());
        when(ldapTemplate.search(any(ContainerCriteria.class), any(AttributesMapper.class))).thenReturn(persons);

        final List<Person> result = personBasicLdapService.findByName("Bob");
        assertNotNull(result);
        assertThat(result.size(), is(1));
    }

}
