package de.dm.common;

import de.dm.common.activedirectory.ActiveDirectoryAuthenticationProviderConfig;
import de.dm.common.basicldap.BasicLdapAuthenticationProviderConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import java.util.Properties;

@Configuration
@Import({BasicLdapAuthenticationProviderConfig.class, ActiveDirectoryAuthenticationProviderConfig.class})
public class DefaultAuthenticationProviderConfig {

    @Value("${selavi.security.userRole}")
    private String userRole;

    @Bean
    @ConditionalOnMissingBean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(createInMemoryUserDetailsManager());
        return daoAuthenticationProvider;
    }

    private UserDetailsService createInMemoryUserDetailsManager() {
        final Properties users = new Properties();
        users.put("user", "password," + userRole + ",enabled"); //add whatever other user you need
        return new InMemoryUserDetailsManager(users);
    }
}
