package de.filiadata.datahub.microservices.business;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.filiadata.datahub.microservices.domain.ConsumeDto;
import de.filiadata.datahub.microservices.domain.HostDto;
import de.filiadata.datahub.microservices.domain.MicroserviceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;

@Service
public class MicroserviceDtoFactory {

    private static final Logger LOG = LoggerFactory.getLogger(MicroserviceDtoFactory.class);

    private final ObjectMapper mapper;

    public MicroserviceDtoFactory() {
        this.mapper = new ObjectMapper();
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public MicroserviceDto getMicroserviceDtoFromJSON(final String json) {

        try {
            final MicroserviceDto microserviceDto = mapper.readValue(json, MicroserviceDto.class);
            if (microserviceDto.getConsumes() == null) {
                microserviceDto.setConsumes(new ArrayList<>());
                microserviceDto.setHosts(new ArrayList<>());
            }
            return microserviceDto;
        } catch (IOException e) {
            LOG.error(e.getMessage(), e);
        }

        return null;
    }

    public String getJsonFromMicroserviceDto(final MicroserviceDto dto) {
        try {
            return mapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            LOG.error(e.getMessage(), e);
        }

        return null;
    }
}
