package de.dm.common.activedirectory;

import de.dm.auth.activedirectory.cache.CachingAuthenticationProvider;
import de.dm.personsearch.PersonRepository;
import de.dm.personsearch.activedirectory.PersonActiveDirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;

@Configuration
@Profile({"active-directory"})
public class ActiveDirectoryAuthenticationProviderConfig {


    @Autowired
    private GrantedAuthoritiesMapper authoritiesMapper;

    @Autowired
    private ActiveDirectoryProperties properties;

    @Autowired
    private LdapContextSource contextSource;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider =
                new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
        provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
        provider.setAuthoritiesMapper(authoritiesMapper);
        return new CachingAuthenticationProvider(provider);
    }

    @Bean
    public LdapContextSource ldapContextSource() {
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(properties.getUrl());
        ldapContextSource.setUserDn(properties.getUserDn());
        ldapContextSource.setPassword(properties.getPassword());
        ldapContextSource.setBase(properties.getBase());
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }

    @Bean
    public PersonRepository personRepository() {
        return new PersonActiveDirectoryService(ldapTemplate());
    }

}
