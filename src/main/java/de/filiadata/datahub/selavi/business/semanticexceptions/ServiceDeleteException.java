package de.filiadata.datahub.selavi.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "The service could not be deleted. Maybe it is a microservice from the registry.")
public class ServiceDeleteException extends RuntimeException {

    public ServiceDeleteException() {
    }

    public ServiceDeleteException(Throwable cause) {
        super(cause);
    }
}
