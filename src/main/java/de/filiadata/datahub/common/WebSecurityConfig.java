package de.filiadata.datahub.common;

import de.filiadata.auth.activedirectory.ActiveDirectoryProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @ActiveDirectoryProvider
    private AuthenticationProvider provider;

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
}
