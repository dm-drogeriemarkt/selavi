package de.filiadata.datahub.business.activedirectory;

import de.filiadata.datahub.business.activedirectory.ActiveDirectoryService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ActiveDirectoryServiceIntegrationTest {

    @Autowired
    private ActiveDirectoryService activeDirectoryService;

    @Test
    public void readAllPersons() {
        List<String> allPersonNames = activeDirectoryService.getAllPersonNames();
        System.out.println(allPersonNames);
    }
}