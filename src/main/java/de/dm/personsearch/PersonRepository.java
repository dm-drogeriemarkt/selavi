package de.dm.personsearch;

import java.util.List;

public interface PersonRepository {

    List<Person> findByName(String name);

}
