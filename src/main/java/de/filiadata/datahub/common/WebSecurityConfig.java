package de.filiadata.datahub.common;

import de.filiadata.auth.activedirectory.cache.CachingAuthenticationProvider;
import de.filiadata.datahub.activedirectory.business.ActiveDirectoryProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private GrantedAuthoritiesMapper authoritiesMapper;

    @Autowired
    private ActiveDirectoryProperties properties;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .exceptionHandling().authenticationEntryPoint(new Http403ForbiddenEntryPoint()).and()
            .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/lib/**").permitAll()
                .antMatchers("/style.css").permitAll()
                .antMatchers("/bundle.js").permitAll()
                .antMatchers("/bitbucket/**").permitAll()
                .antMatchers("/person/**").permitAll()
                .antMatchers("/_system/**").permitAll()
                .antMatchers(HttpMethod.GET, "/services").permitAll()
                .antMatchers(HttpMethod.POST, "/services/**").hasRole("SECDE-ZOE-TEST-ADMINS")
                .antMatchers(HttpMethod.PUT, "/services/**").hasRole("SECDE-ZOE-TEST-ADMINS")
                .antMatchers(HttpMethod.DELETE, "/services/**").hasRole("SECDE-ZOE-TEST-ADMINS")
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll()
                .logoutSuccessHandler((new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK)))
                .and()
            .csrf()
                .disable();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CachingAuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider;
        provider = new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
        provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
        provider.setAuthoritiesMapper(authoritiesMapper);
        return new CachingAuthenticationProvider(provider);
    }
}
