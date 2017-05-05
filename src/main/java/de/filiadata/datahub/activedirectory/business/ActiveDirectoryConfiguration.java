package de.filiadata.datahub.activedirectory.business;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class ActiveDirectoryConfiguration {

    @Bean
    public ContextSource ldapContextSource(ActiveDirectoryProperties properties) {
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(properties.getUrl());
        ldapContextSource.setUserDn(properties.getUserDn());
        ldapContextSource.setPassword(properties.getPassword());
        ldapContextSource.setBase(properties.getBase());
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate(ContextSource contextSource) {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }
}
