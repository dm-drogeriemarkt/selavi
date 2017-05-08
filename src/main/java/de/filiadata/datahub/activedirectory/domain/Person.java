package de.filiadata.datahub.activedirectory.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Person {

    private String uid;
    private String displayName;
    private String eMail;
    private byte[] thumbnailPhoto;
}
