package de.dm.personsearch;

import de.dm.selavi.personrepositorycore.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;

@Configuration
@Profile({"basic"})
public class BasicPersonSearchConfiguration {

    @Autowired
    private ContextSource contextSource;

    @Bean
    @ConditionalOnMissingBean(PersonRepository.class)
    public PersonRepository personRepository() {
        final LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        return new BasicPersonSearchService(ldapTemplate);
    }

}
