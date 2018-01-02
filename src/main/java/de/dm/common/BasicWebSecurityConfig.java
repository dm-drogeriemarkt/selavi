package de.dm.common;

import de.dm.activedirectory.business.ActiveDirectoryProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

@Configuration
@EnableWebSecurity
@Profile({"local", "development-h2", "development-mysql"})
@Order(2)
public class BasicWebSecurityConfig extends WebSecurityConfigurerAdapter {
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

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth
				.inMemoryAuthentication()
				.withUser("user").password("password").roles(userRole);
	}
}