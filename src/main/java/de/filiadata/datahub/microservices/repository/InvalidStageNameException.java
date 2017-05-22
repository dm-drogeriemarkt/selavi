package de.filiadata.datahub.microservices.repository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidStageNameException extends RuntimeException {
    public InvalidStageNameException(String message) {
        super(message);
    }
}
