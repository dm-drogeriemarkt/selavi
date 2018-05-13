package de.dm.common.basicldap;

import de.dm.personsearch.PersonRepository;
import de.dm.personsearch.basicldap.PersonBasicLdapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.encoding.PlaintextPasswordEncoder;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.LdapAuthenticator;
import org.springframework.security.ldap.authentication.PasswordComparisonAuthenticator;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;

@Configuration
@Profile({"basicldap"})
public class BasicLdapAuthenticationProviderConfig {

    @Autowired
    private EmbeddedLdapProperties properties;

    @Autowired
    private GrantedAuthoritiesMapper authorietiesMapper;

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationProvider authenticationProvider() {

        LdapAuthenticationProvider ldapAuthenticationProvider = new LdapAuthenticationProvider(ldapAuthenticator());
        ldapAuthenticationProvider.setUseAuthenticationRequestCredentials(true);
        ldapAuthenticationProvider.setAuthoritiesMapper(authorietiesMapper);
        ldapAuthenticationProvider.setUserDetailsContextMapper(new LdapUserDetailsMapper());
        return ldapAuthenticationProvider;
    }

    @Bean
    public LdapAuthenticator ldapAuthenticator() {

        PasswordComparisonAuthenticator ldapAuthenticator = new PasswordComparisonAuthenticator(ldapContextSource());
        ldapAuthenticator.setPasswordAttributeName("userPassword");
        ldapAuthenticator.setPasswordEncoder(new PlaintextPasswordEncoder());
        String[] userDnPatterns = new String[1];
        userDnPatterns[0] = "uid={0},ou=people";
        ldapAuthenticator.setUserDnPatterns(userDnPatterns);
        return ldapAuthenticator;
    }

    @Bean
    public LdapContextSource ldapContextSource() {

        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl("ldap://localhost:" + properties.getPort() + "/" + properties.getBaseDn());
        ldapContextSource.afterPropertiesSet();
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() {
        LdapTemplate ldapTemplate = new LdapTemplate(ldapContextSource());
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }

    @Bean
    public PersonRepository personRepository() {
        return new PersonBasicLdapService(ldapTemplate());
    }
}
