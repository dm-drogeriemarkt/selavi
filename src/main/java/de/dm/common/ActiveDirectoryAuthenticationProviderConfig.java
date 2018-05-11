package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryProperties;
import de.dm.auth.activedirectory.cache.CachingAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;

@Configuration
@Profile({"activedirectory"})
public class ActiveDirectoryAuthenticationProviderConfig {


    @Autowired
    private GrantedAuthoritiesMapper authoritiesMapper;

    @Autowired
    private ActiveDirectoryProperties properties;

    @Value("${selavi.security.userRole}")
    private String userRole;

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationProvider authenticationProvider() {
        Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider =
                new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
        provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
        provider.setAuthoritiesMapper(authoritiesMapper);
        return new CachingAuthenticationProvider(provider);
    }

    @Bean
    public LdapContextSource ldapContextSource(ActiveDirectoryProperties properties) {
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(properties.getUrl());
        ldapContextSource.setUserDn(properties.getUserDn());
        ldapContextSource.setPassword(properties.getPassword());
        ldapContextSource.setBase(properties.getBase());
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate(LdapContextSource contextSource) {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }

}
