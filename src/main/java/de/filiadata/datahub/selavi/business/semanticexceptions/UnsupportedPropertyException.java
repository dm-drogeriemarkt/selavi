package de.filiadata.datahub.selavi.business.semanticexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY, reason = "Property must not be changed because it's an unmodifiable service property.")
public class UnsupportedPropertyException extends RuntimeException {
}
