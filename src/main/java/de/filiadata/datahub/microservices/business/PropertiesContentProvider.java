package de.filiadata.datahub.microservices.business;


import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Map;

public interface PropertiesContentProvider {

    Map<String, ObjectNode> getContent();
}
