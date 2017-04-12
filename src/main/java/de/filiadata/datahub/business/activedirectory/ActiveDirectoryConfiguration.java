package de.filiadata.datahub.business.activedirectory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class ActiveDirectoryConfiguration {

    public static final String USER_DN = "cn=DE-ServiceUser\\, Selavi-AD - username,ou=ServiceUsers,ou=Users,ou=DE,ou=dm,dc=dm,dc=int";
    public static final String BASE = "ou=dm,dc=dm,dc=int";

    @Bean
    public ContextSource ldapContextSource(ActiveDirectoryProperties properties) {
        // TODO: 29.03.17 configure
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(properties.getUrl());
        ldapContextSource.setUserDn(USER_DN);
        ldapContextSource.setPassword(properties.getPassword());
        ldapContextSource.setBase(BASE);
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate(ContextSource contextSource) {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }
}
