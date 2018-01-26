package de.dm.activedirectory.business;

import de.dm.personsearch.InMemoryPersonSearchService;
import de.dm.selavi.personrepositorycore.Person;
import de.dm.selavi.personrepositorycore.PersonRepository;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQuery;

import javax.naming.directory.Attributes;
import javax.naming.directory.BasicAttributes;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class ActiveDirectoryServiceUnitTest {


    private LdapTemplate ldapTemplate = mock(LdapTemplate.class);

    @Test
    public void getAllPersonNames() throws Exception {
        PersonRepository activeDirectoryService = new InMemoryPersonSearchService();
        activeDirectoryService.findByName("Alt, foo");

        ArgumentCaptor<LdapQuery> queryArgumentCaptor = ArgumentCaptor.forClass(LdapQuery.class);
        ArgumentCaptor<AttributesMapper> mapperArgumentCaptor = ArgumentCaptor.forClass(AttributesMapper.class);

        verify(ldapTemplate).search(queryArgumentCaptor.capture(), mapperArgumentCaptor.capture());

        assertThat(queryArgumentCaptor.getValue().filter().toString(),
                is("(&(objectclass=user)(!(objectclass=computer))(sAMAccountName=*)(!(sAMAccountName=*Admin*))(mail=*)(name=*Alt,*foo*))"));

        Attributes attributes = new BasicAttributes();
        attributes.put("sAMAccountName", "fbc");
        attributes.put("displayname", "Altmann, Erik");
        attributes.put("mail", "john.doe@example.com");
        byte[] selfie = {};
        attributes.put("thumbnailphoto", selfie);

        Person person = (Person) mapperArgumentCaptor.getValue().mapFromAttributes(attributes);

        assertThat(person.getId(), is("fbc"));
        assertThat(person.getDisplayName(), is("Altmann, Erik"));
        assertThat(person.getEMail(), is("john.doe@example.com"));
        assertThat(person.getThumbnailPhoto(), is(selfie));
    }

}
