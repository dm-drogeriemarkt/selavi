package de.filiadata.datahub.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity(name = "consumer_relations")
@AllArgsConstructor
@Getter
@Setter
public class ConsumerRelation implements Serializable {

    public ConsumerRelation() {
    }

    @Id
    private String id;

    private String content;
}
