package de.filiadata.datahub.business.activedirectory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class ActiveDirectoryConfiguration {

    // Dn: cn=DE-ServiceUser\, Selavi-AD - username,ou=ServiceUsers,ou=Users,ou=DE,ou=dm,dc=dm,dc=int; Username: username; Password: [PROTECTED]
    @Bean
    public ContextSource ldapContextSource() {
        // TODO: 29.03.17 configure
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl("ldaps://example.com:636");
        ldapContextSource.setUserDn("cn=DE-ServiceUser\\, Selavi-AD - username,ou=ServiceUsers,ou=Users,ou=DE,ou=dm,dc=dm,dc=int");
        ldapContextSource.setPassword("password");
        ldapContextSource.setBase("dc=dm,dc=int");
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate(ContextSource contextSource) {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }
}
