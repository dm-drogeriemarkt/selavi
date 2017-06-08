package de.filiadata.datahub.common;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class HttpOkAuthenticationSuccessHandlerTest {

    private HttpOkAuthenticationSuccessHandler httpOkAuthenticationSuccessHandler;

    @Before
    public void setup() {
        httpOkAuthenticationSuccessHandler = new HttpOkAuthenticationSuccessHandler();
    }

    @Test
    public void onAuthenticationSuccessRedirectsToUserController() throws IOException, ServletException {
        MockHttpServletRequest request = MockMvcRequestBuilders.post("login").buildRequest(null);

        HttpServletResponse response = mock(HttpServletResponse.class);

        httpOkAuthenticationSuccessHandler.onAuthenticationSuccess(request, response, null);

        verify(response).sendRedirect("user");
    }

}