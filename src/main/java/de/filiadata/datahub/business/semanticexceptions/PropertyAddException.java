package de.filiadata.datahub.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "An error occured while adding the property.")
public class PropertyAddException extends RuntimeException {

}
