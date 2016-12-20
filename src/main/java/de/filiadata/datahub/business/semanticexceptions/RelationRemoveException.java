package de.filiadata.datahub.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "An error occured while removing a relation.")
public class RelationRemoveException extends RuntimeException {

    public RelationRemoveException() {
    }

    public RelationRemoveException(Throwable cause) {
        super(cause);
    }
}
