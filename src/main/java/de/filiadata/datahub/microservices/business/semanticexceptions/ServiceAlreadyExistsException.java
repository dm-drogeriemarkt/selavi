package de.filiadata.datahub.microservices.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "The service could not be created because it already exists.")
public class ServiceAlreadyExistsException extends RuntimeException {
}
