package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryProperties;
import de.dm.auth.activedirectory.cache.CachingAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import java.util.Properties;

@Configuration
@Profile({"active-direcotry"})
public class ActiveDirecotryAuthenticationProviderConfig {

	@Autowired
	private GrantedAuthoritiesMapper authoritiesMapper;

	@Autowired
	private ActiveDirectoryProperties properties;

	@Value("${selavi.security.userRole}")
	private String userRole;

	@Bean
	public AuthenticationProvider adAuthenticationProvider() {
		Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider;
		provider = new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
		provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
		provider.setAuthoritiesMapper(authoritiesMapper);
		return new CachingAuthenticationProvider(provider);
	}
}
