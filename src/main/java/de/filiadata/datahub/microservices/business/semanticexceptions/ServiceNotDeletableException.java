package de.filiadata.datahub.microservices.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "The service could not be deleted because it is a service from the registry.")
public class ServiceNotDeletableException extends RuntimeException {

	public ServiceNotDeletableException() {
	}
}
