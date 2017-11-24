package de.dm.common;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

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
