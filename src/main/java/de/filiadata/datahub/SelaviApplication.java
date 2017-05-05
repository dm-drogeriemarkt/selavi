package de.filiadata.datahub;

import com.google.common.cache.CacheBuilder;
import de.filiadata.datahub.activedirectory.business.ActiveDirectoryProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.guava.GuavaCacheManager;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableCaching
@EnableSwagger2
@EnableDiscoveryClient
@EnableConfigurationProperties(ActiveDirectoryProperties.class)
public class SelaviApplication extends SpringBootServletInitializer {

    @Value("${cache.expireAfterWriteInMinutes}")
    private Integer expireAfterWriteInMinutes;

    public static void main(String[] args) {
        SpringApplication.run(SelaviApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public CacheManager cacheManager() {
        final CacheBuilder<Object, Object> cacheBuilder = CacheBuilder.newBuilder().expireAfterWrite(expireAfterWriteInMinutes, TimeUnit.MINUTES);
        final GuavaCacheManager guavaCacheManager = new GuavaCacheManager();
        guavaCacheManager.setAllowNullValues(false);
        guavaCacheManager.setCacheBuilder(cacheBuilder);

        return guavaCacheManager;
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("de.filiadata.datahub"))
                .paths(PathSelectors.any())
                .build()
                .pathMapping("/");
    }
}
