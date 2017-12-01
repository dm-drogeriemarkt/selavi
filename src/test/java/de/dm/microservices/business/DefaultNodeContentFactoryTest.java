package de.dm.microservices.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.dm.microservices.business.DefaultNodeContentFactory;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class DefaultNodeContentFactoryTest {

    private static final String SERVICE_NAME = "halo i bims der servis";
    private ObjectMapper mapper = new ObjectMapper();

    private DefaultNodeContentFactory factory = new DefaultNodeContentFactory(mapper);

    @Test
    public void create() {
        ObjectNode result = factory.create(SERVICE_NAME);

        assertThat(result.get("id").textValue(), is(SERVICE_NAME));
        assertThat(result.get("label").textValue(), is(SERVICE_NAME));
    }
}