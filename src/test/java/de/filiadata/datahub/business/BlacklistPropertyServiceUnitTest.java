package de.filiadata.datahub.business;


import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = BlacklistPropertyService.class)
public class BlacklistPropertyServiceUnitTest {

    @Autowired
    BlacklistPropertyService blacklistPropertyService;

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