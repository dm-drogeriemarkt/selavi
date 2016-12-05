package de.filiadata.datahub.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity(name = "serviceinformations")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ServiceProperties implements Serializable {

    @Id
    private String id;

    private String content;
}
