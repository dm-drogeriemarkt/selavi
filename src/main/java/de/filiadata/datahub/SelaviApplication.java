package de.filiadata.datahub;

import com.google.common.cache.CacheBuilder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.guava.GuavaCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableCaching
public class SelaviApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SelaviApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(SelaviApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public CacheManager cacheManager() {
        final int minutesForExpiry = 10; // TODO: externalize into config
        final CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterWrite(minutesForExpiry, TimeUnit.MINUTES);
        final GuavaCacheManager guavaCacheManager = new GuavaCacheManager();
        guavaCacheManager.setAllowNullValues(false);
        guavaCacheManager.setCacheBuilder(cacheBuilder);

        return guavaCacheManager;
    }
}
