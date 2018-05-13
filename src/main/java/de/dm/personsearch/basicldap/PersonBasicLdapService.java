package de.dm.personsearch.basicldap;

import de.dm.personsearch.Person;
import de.dm.personsearch.PersonRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.ContainerCriteria;
import org.springframework.ldap.query.LdapQueryBuilder;

import java.util.List;

@Slf4j
public class PersonBasicLdapService implements PersonRepository {

    private final LdapTemplate ldapTemplate;

    public PersonBasicLdapService(LdapTemplate ldapTemplate) {
        this.ldapTemplate = ldapTemplate;
    }

    public List<Person> findByName(String name) {
        String ldapQuery = "*" + name + "*";
        ldapQuery = ldapQuery.replace(' ', '*');
        ContainerCriteria containerCriteria = LdapQueryBuilder.query().where("objectclass").is("person").and("uid").like(ldapQuery);
        AttributesMapper<Person> attributesMapper = (attrs) -> {
            Person.PersonBuilder builder = Person.builder().id((String) attrs.get("uid").get()).displayName((String) attrs.get("uid").get());
            if (attrs.get("thumbnailphoto") != null) {
                builder.thumbnailPhoto((byte[]) ((byte[]) attrs.get("thumbnailphoto").get()));
            }

            return builder.build();
        };
        log.info("Search person for name {}", name);
        return this.ldapTemplate.search(containerCriteria, attributesMapper);
    }

}
