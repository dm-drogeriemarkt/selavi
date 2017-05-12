package de.filiadata.datahub.microservices.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class BlacklistPropertyService {

    private Set<String> blacklistProperties = new HashSet<>();

    @Autowired
    public BlacklistPropertyService(@Value("#{'${selavi.property.blacklist}'.split(',')}") Set<String> blacklistProperties) {
        this.blacklistProperties = blacklistProperties;
    }

    public boolean isBlacklistProperty(String propertyName) {
        return blacklistProperties.contains(propertyName);
    }
}
