package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryProperties;
import de.dm.auth.activedirectory.cache.CachingAuthenticationProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;

@Configuration
@Profile({"active-directory"})
public class ActiveDirectoryAuthenticationProviderConfig {

    private final GrantedAuthoritiesMapper authoritiesMapper;
    private final ActiveDirectoryProperties properties;
    private final String userRole;

    public ActiveDirectoryAuthenticationProviderConfig(GrantedAuthoritiesMapper authoritiesMapper,
                                                       ActiveDirectoryProperties properties,
                                                       @Value("${selavi.security.userRole}") String userRole) {
        this.authoritiesMapper = authoritiesMapper;
        this.properties = properties;
        this.userRole = userRole;
    }

    @Bean
	public AuthenticationProvider adAuthenticationProvider() {
		Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider;
		provider = new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
		provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
		provider.setAuthoritiesMapper(authoritiesMapper);
		return new CachingAuthenticationProvider(provider);
	}
}
