package de.filiadata.datahub.selavi.business;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class RelationArrayNodeMergerUnitTest {

    private RelationArrayNodeMerger merger;
    private ObjectMapper objectMapper;

    @Before
    public void setUp() throws Exception {
        this.merger = new RelationArrayNodeMerger();
        this.objectMapper = new ObjectMapper();
    }

    @Test
    public void merge() throws Exception {
        JsonNode existingConsumerArrayNode = objectMapper.readTree("[{\"target\":\"KCB-SHOP\",\"type\":\"REST\"},{\"target\":\"KCB-SERVICECENTER\",\"type\":\"SOAP\"},{\"target\":\"KCB-ASSETS\"}]");
        JsonNode updatedConsumerNode = objectMapper.readTree("{\"target\":\"KCB-ASSETS\",\"type\":\"FOO\"}");

        JsonNode mergedNode = merger.merge(existingConsumerArrayNode, updatedConsumerNode);

        assertThat(mergedNode.toString(), is("[{\"target\":\"KCB-SHOP\",\"type\":\"REST\"},{\"target\":\"KCB-SERVICECENTER\",\"type\":\"SOAP\"},{\"target\":\"KCB-ASSETS\",\"type\":\"FOO\"}]"));
    }

    @Test
    public void mergeNoTypeIsNullsafe() throws Exception {
        JsonNode existingConsumerArrayNode = objectMapper.readTree("[{\"target\":\"KCB-SHOP\",\"type\":\"REST\"},{\"target\":\"KCB-SERVICECENTER\",\"type\":\"SOAP\"},{\"target\":\"KCB-ASSETS\"}]");
        JsonNode updatedConsumerNode = objectMapper.readTree("{\"target\":\"KCB-SHOP\",\"type\":\"FOO\"}");

        JsonNode mergedNode = merger.merge(existingConsumerArrayNode, updatedConsumerNode);

        assertThat(mergedNode.toString(), is("[{\"target\":\"KCB-SHOP\",\"type\":\"FOO\"},{\"target\":\"KCB-SERVICECENTER\",\"type\":\"SOAP\"},{\"target\":\"KCB-ASSETS\",\"type\":\"\"}]"));
    }
}
