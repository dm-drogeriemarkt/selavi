package de.filiadata.datahub.selavi.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity(name = "service_properties")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ServiceProperties implements Serializable {

    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column(nullable = false, length = Integer.MAX_VALUE)
    private String content;
}
