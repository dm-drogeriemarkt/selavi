package de.dm.personsearch;

import de.dm.selavi.personrepositorycore.PersonRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PersonSearchConfiguration {

    @Bean
    @ConditionalOnMissingBean(PersonRepository.class)
    public PersonRepository inMemoryPersonRepository() {
        return new InMemoryPersonSearchService();
    }

}
