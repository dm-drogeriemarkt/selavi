package de.dm.common;

import de.dm.personsearch.BasicPersonSearchService;
import de.dm.selavi.personrepositorycore.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.encoding.PlaintextPasswordEncoder;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.PasswordComparisonAuthenticator;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;

@Configuration
@Profile({"basic"})
public class BasicAuthenticationProviderConfig {

    @Autowired
    private ContextSource contextSource;

    @Autowired
    private EmbeddedLdapProperties properties;

    @Autowired
    private GrantedAuthoritiesMapper authorietiesMapper;

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationProvider authenticationProvider() {
        LdapUserDetailsMapper ldapUserDetailsMapper = new LdapUserDetailsMapper();
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl("ldap://localhost:" + properties.getPort() + "/" + properties.getBaseDn());
        ldapContextSource.afterPropertiesSet();
        PasswordComparisonAuthenticator ldapAuthenticator = new PasswordComparisonAuthenticator(ldapContextSource);
        ldapAuthenticator.setPasswordAttributeName("userPassword");
        ldapAuthenticator.setPasswordEncoder(new PlaintextPasswordEncoder());
        String[] userDnPatterns = new String[1];
        userDnPatterns[0] = "uid={0},ou=people";
        ldapAuthenticator.setUserDnPatterns(userDnPatterns);
        LdapAuthenticationProvider ldapAuthenticationProvider = new LdapAuthenticationProvider(ldapAuthenticator);
        ldapAuthenticationProvider.setUseAuthenticationRequestCredentials(true);
        ldapAuthenticationProvider.setAuthoritiesMapper(authorietiesMapper);
        ldapAuthenticationProvider.setUserDetailsContextMapper(ldapUserDetailsMapper);
        return ldapAuthenticationProvider;
    }


    @Bean
    @ConditionalOnMissingBean(PersonRepository.class)
    public PersonRepository personRepository() {
        final LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        return new BasicPersonSearchService(ldapTemplate);
    }

}
