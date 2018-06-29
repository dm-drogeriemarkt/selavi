package de.dm.personsearch;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Person {

    private String id;
    private String displayName;
    private String eMail;
    private byte[] thumbnailPhoto;

}
