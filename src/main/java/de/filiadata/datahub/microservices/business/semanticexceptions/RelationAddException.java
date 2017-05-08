package de.filiadata.datahub.microservices.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "An error occured while adding a relation.")
public class RelationAddException extends RuntimeException {

}
