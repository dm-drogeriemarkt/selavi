package de.filiadata.datahub.microservices.business;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BlacklistPropertyService {

    private static final Logger LOG = LoggerFactory.getLogger(BlacklistPropertyService.class);
    private Set<String> blacklistProperties = new HashSet<>();
    private ResourceLoader resourceLoader;

    @Autowired
    public BlacklistPropertyService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public boolean isBlacklistProperty(String propertyName) {
        org.springframework.core.io.Resource resource = resourceLoader.getResource("classpath:properties-blacklist.txt");
        if (!resource.exists()) {
            return false;
        }

        final List<String> properties = loadFromFile(resource);
        if (properties == null) {
            return false;
        }

        initializePropertiesSet(properties);
        return blacklistProperties.contains(propertyName);
    }

    private List<String> loadFromFile(Resource resource) {
        List<String> properties = null;
        try {
            properties = Files.readAllLines(Paths.get(resource.getURI()));
        } catch (IOException e) {
            LOG.warn("Blacklist properties file could not be load!");
        }
        return properties;
    }

    private void initializePropertiesSet(List<String> properties) {
        if (blacklistProperties.isEmpty()) {
            blacklistProperties.addAll(properties);
        }
    }
}
