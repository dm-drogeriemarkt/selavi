package de.filiadata.datahub.business;


import de.filiadata.datahub.SelaviApplication;
import de.filiadata.datahub.business.bitbucket.BitbucketAuthorDto;
import de.filiadata.datahub.business.bitbucket.BitbucketService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SelaviApplication.class)
public class BitbucketServiceIntegrationTest {

    @Autowired
    BitbucketService bitbucketService;

    @Test
    public void test() throws Exception {
        String url = "https://example.com/rest/api/1.0/projects/ZOE/repos/ZOE/commits?limit=500";

        final Map<BitbucketAuthorDto, Long> top3Commiters = bitbucketService.getTopCommitters(url);
        System.out.println(top3Commiters);
        Assert.assertNotNull(top3Commiters);
    }

}