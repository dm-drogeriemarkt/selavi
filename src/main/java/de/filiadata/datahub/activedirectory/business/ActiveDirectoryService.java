package de.filiadata.datahub.activedirectory.business;

import de.filiadata.datahub.activedirectory.domain.Person;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.ContainerCriteria;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

@Service
public class ActiveDirectoryService {

	private LdapTemplate ldapTemplate;

	public ActiveDirectoryService(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}

	public List<Person> getAllPersonNames(String query) {
		String ldapQuery = "*" + query + "*";
		ldapQuery = ldapQuery.replace(' ', '*');

		final ContainerCriteria containerCriteria = query()
			.where("objectclass").is("user")
			.and("objectclass").not().is("computer")
			.and("sAMAccountName").isPresent()
			.and("sAMAccountName").not().like("*Admin*")
			.and("mail").isPresent()
			.and("name").like(ldapQuery);

		final AttributesMapper<Person> attributesMapper = attrs -> {
			Person.PersonBuilder builder = Person.builder()
				.uid((String) attrs.get("sAMAccountName").get())
				.displayName((String) attrs.get("displayname").get())
				.eMail((String) attrs.get("mail").get());

			if (attrs.get("thumbnailphoto") != null) {
				builder.thumbnailPhoto((byte[]) attrs.get("thumbnailphoto").get());
			}

			return builder.build();

		};

		return ldapTemplate.search(containerCriteria, attributesMapper);
	}
}
