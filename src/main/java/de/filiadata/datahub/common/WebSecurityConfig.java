package de.filiadata.datahub.common;

import de.filiadata.datahub.activedirectory.business.ActiveDirectoryProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.encoding.LdapShaPasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private ActiveDirectoryProperties activeDirectoryProperties;
    private LdapContextSource ldapContextSource;

    public WebSecurityConfig(ActiveDirectoryProperties activeDirectoryProperties, LdapContextSource ldapContextSource) {
        this.activeDirectoryProperties = activeDirectoryProperties;
        this.ldapContextSource = ldapContextSource;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/**").permitAll()
                .antMatchers(HttpMethod.GET, "/services/**").permitAll()
                .antMatchers(HttpMethod.POST, "/services/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/services/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/services/**").hasRole("ADMIN")
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

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .ldapAuthentication()
                .userSearchFilter("(&(sAMAccountName={0})(objectClass=User))")
                .groupSearchBase("ou=Users,ou=DE,ou=dm,dc=dm,dc=int")
                .contextSource(ldapContextSource)
                .passwordCompare()
                .passwordEncoder(new LdapShaPasswordEncoder())
                .passwordAttribute("userPassword");
    }
}
