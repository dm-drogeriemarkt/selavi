package de.dm.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.encoding.PlaintextPasswordEncoder;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.authentication.PasswordComparisonAuthenticator;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;

@Configuration
@Profile({"basic"})
public class BasicAuthenticationProviderConfig {

    @Autowired
    private EmbeddedLdapProperties properties;

    @Value("${selavi.security.userRole}")
    private String userRole;

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationProvider authenticationProvider() {
        LdapUserDetailsMapper userDetailsContextMapper = new LdapUserDetailsMapper();
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
        ldapAuthenticationProvider.setUserDetailsContextMapper(userDetailsContextMapper);
        return ldapAuthenticationProvider;
    }

}
