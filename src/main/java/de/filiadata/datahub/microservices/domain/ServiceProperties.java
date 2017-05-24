package de.filiadata.datahub.microservices.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity(name = "service_properties")
@NoArgsConstructor
@Getter
@Setter
public class ServiceProperties implements Serializable {

    public ServiceProperties(String id, String stage, String content) {
        pk = new ServicePropertiesPk(id, stage);
        this.content = content;
    }

    @EmbeddedId
    private ServicePropertiesPk pk;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String content;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class ServicePropertiesPk implements Serializable {
        @Column(nullable = false)
        private String id;

        @Column(nullable = false)
        private String stage;
    }
}
