package main.server.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import main.server.sql.dto.ErrorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
						 AuthenticationException authException)
			throws IOException, ServletException {
		logger.error("Unauthorized error: {}", authException.getMessage());

		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		ErrorDTO error = new ErrorDTO(
				request.getServletPath(),
				"Unauthorized to access this resource",
				HttpStatus.UNAUTHORIZED,
				authException.getMessage()
		);
		final ObjectMapper mapper = new ObjectMapper();
		mapper.writeValue(response.getOutputStream(), error);
	}
}