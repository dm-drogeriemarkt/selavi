package de.dm.common;

import de.dm.auth.activedirectory.ActiveDirectoryAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

@Configuration
@Import(ActiveDirectoryAutoConfiguration.class)
@Profile({"activedirectory"})
public class ActiveDirecotryAuthenticationProviderConfig {
    /*
        @Autowired
        private GrantedAuthoritiesMapper authoritiesMapper;

        @Autowired
        private ActiveDirectoryProperties properties;

        @Value("${selavi.security.userRole}")
        private String userRole;

        @Bean
        @ConditionalOnMissingBean
        public AuthenticationProvider adAuthenticationProvider() {
            Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider =
                    new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
            provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
            provider.setAuthoritiesMapper(authoritiesMapper);
            return new CachingAuthenticationProvider(provider);
        }*/
}
