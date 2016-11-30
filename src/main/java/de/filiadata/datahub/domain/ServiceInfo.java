package de.filiadata.datahub.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity(name = "serviceinformations")
@AllArgsConstructor
@Getter
@Setter

public class ServiceInfo implements Serializable {

    public ServiceInfo() {
    }

    @Id
    private String id;

    private String content;
}
