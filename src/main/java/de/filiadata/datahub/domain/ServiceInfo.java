package de.filiadata.datahub.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Data
@Entity(name = "serviceinformations")
public class ServiceInfo implements Serializable {

    @Id
    private String id;

    private String content;
}
