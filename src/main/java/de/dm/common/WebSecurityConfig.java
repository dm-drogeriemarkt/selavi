package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryProperties;
import de.dm.auth.activedirectory.cache.CachingAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.ldap.authentication.ad.Hotfix3960ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private GrantedAuthoritiesMapper authoritiesMapper;

    @Autowired
    private ActiveDirectoryProperties properties;

    @Value("${selavi.security.userRole}")
    private String userRole;

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
                .antMatchers(HttpMethod.GET, "/services/**").permitAll()
                .antMatchers(HttpMethod.POST, "/services/**").hasRole(userRole)
                .antMatchers(HttpMethod.PUT, "/services/**").hasRole(userRole)
                .antMatchers(HttpMethod.DELETE, "/services/**").hasRole(userRole)
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .successHandler(new HttpOkAuthenticationSuccessHandler())
                .failureHandler(new SimpleUrlAuthenticationFailureHandler())
                .and()
            .logout()
                .permitAll()
                .logoutSuccessHandler((new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK)))
                .and()
            .csrf()
                .disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        Hotfix3960ActiveDirectoryLdapAuthenticationProvider provider;
        provider = new Hotfix3960ActiveDirectoryLdapAuthenticationProvider(properties.getDomain(), properties.getUrl(), properties.getBase());
        provider.setSearchFilter("(&(objectClass=user)(samAccountName={1}))");
        provider.setAuthoritiesMapper(authoritiesMapper);
        auth.authenticationProvider(new CachingAuthenticationProvider(provider));
    }
}
