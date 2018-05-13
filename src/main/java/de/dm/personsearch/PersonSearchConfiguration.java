package de.dm.personsearch;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class PersonSearchConfiguration {

    @Bean
    @ConditionalOnMissingBean(PersonRepository.class)
    public PersonRepository inMemoryPersonRepository() {
        return new InMemoryPersonSearchService();
    }

}
