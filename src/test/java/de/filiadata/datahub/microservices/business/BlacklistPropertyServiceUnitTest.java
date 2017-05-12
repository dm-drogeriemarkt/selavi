package de.filiadata.datahub.microservices.business;


import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.MatcherAssert.assertThat;

public class BlacklistPropertyServiceUnitTest {

    BlacklistPropertyService blacklistPropertyService;

    @Before
    public void setup() {
        blacklistPropertyService = new BlacklistPropertyService(new HashSet<>(Arrays.asList("instanceId")));
    }

    @Test
    public void shouldNotContainProperty() throws Exception {
        // when
        boolean result = blacklistPropertyService.isBlacklistProperty("foo");

        // then
        assertThat(result, Matchers.is(false));
    }

    @Test
    public void shouldContainProperty() throws Exception {
        // when
        boolean result = blacklistPropertyService.isBlacklistProperty("instanceId");

        // then
        assertThat(result, Matchers.is(true));
    }
}
