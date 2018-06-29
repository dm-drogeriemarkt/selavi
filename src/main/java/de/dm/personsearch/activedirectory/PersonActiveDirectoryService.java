package de.dm.personsearch.activedirectory;

import de.dm.personsearch.Person;
import de.dm.personsearch.PersonRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.ContainerCriteria;

import java.util.List;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Slf4j
public class PersonActiveDirectoryService implements PersonRepository {

    private final LdapTemplate ldapTemplate;

    public PersonActiveDirectoryService(LdapTemplate ldapTemplate) {
        this.ldapTemplate = ldapTemplate;
    }

    @Override
    public List<Person> findByName(String name) {
        String ldapQuery = "*" + name + "*";
        ldapQuery = ldapQuery.replace(' ', '*');

        final ContainerCriteria containerCriteria = query()
                .where("objectclass").is("user")
                .and("objectclass").not().is("computer")
                .and("sAMAccountName").isPresent()
                .and("sAMAccountName").not().like("*Admin*")
                .and("mail").isPresent()
                .and("name").like(ldapQuery);

        final AttributesMapper<Person> attributesMapper = attrs -> {
            Person.PersonBuilder builder = Person.builder()
                    .id((String) attrs.get("sAMAccountName").get())
                    .displayName((String) attrs.get("displayname").get())
                    .eMail((String) attrs.get("mail").get());

            if (attrs.get("thumbnailphoto") != null) {
                builder.thumbnailPhoto((byte[]) attrs.get("thumbnailphoto").get());
            }

            return builder.build();

        };

        log.info("Search person for name {}", name);
        return ldapTemplate.search(containerCriteria, attributesMapper);
    }

}
