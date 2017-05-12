package de.filiadata.datahub.common;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class UserController {

    @RequestMapping("/user")
    public String getUserDetails(Principal principal) {
        return principal.getName();
    }
}
