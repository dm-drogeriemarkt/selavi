package de.dm.personsearch;

import de.dm.selavi.personrepositorycore.Person;
import de.dm.selavi.personrepositorycore.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.ContainerCriteria;
import org.springframework.ldap.query.LdapQueryBuilder;

import java.util.List;

public class BasicPersonSearchService implements PersonRepository {

    private static final Logger log = LoggerFactory.getLogger(BasicPersonSearchService.class);
    private final LdapTemplate ldapTemplate;

    public BasicPersonSearchService(LdapTemplate ldapTemplate) {
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
