package de.filiadata.datahub.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "The service could not be created. Maybe it already exists.")
public class ServiceAddException extends RuntimeException {
}
