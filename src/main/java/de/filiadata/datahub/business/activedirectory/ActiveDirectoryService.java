package de.filiadata.datahub.business.activedirectory;

import org.springframework.ldap.NamingException;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;

import javax.naming.directory.Attributes;
import java.util.List;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
public class ActiveDirectoryService {

    private LdapTemplate ldapTemplate;

    public ActiveDirectoryService(LdapTemplate ldapTemplate) {
        this.ldapTemplate = ldapTemplate;
    }

    public List<Person> getAllPersonNames(String query) {
        String ldapQuery = "*" + query + "*";
        ldapQuery = ldapQuery.replace(' ', '*');

        return ldapTemplate.search(
                query().where("objectclass").is("user")
                        .and("objectclass").not().is("computer")
                        .and("sAMAccountName").isPresent()
//                        .and("sAMAccountName").not().like("*Admin*")
                        .and("mail").isPresent()
                        .and("name").like(ldapQuery),
                new AttributesMapper<Person>() {
                    public Person mapFromAttributes(Attributes attrs)
                            throws NamingException, javax.naming.NamingException {
                        Person.PersonBuilder builder = Person.builder()
                                .uid((String) attrs.get("sAMAccountName").get())
                                .displayName((String) attrs.get("displayname").get())
                                .eMail((String) attrs.get("mail").get());

                        if (attrs.get("thumbnailphoto") != null) {
                            builder.thumbnailPhoto((byte[]) attrs.get("thumbnailphoto").get());
                        }

                        return builder.build();

                    }
                });
    }
}
