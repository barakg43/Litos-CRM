package main.server.config;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import main.server.exceptions.ResourceNotFoundException;
import main.server.sql.dto.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

	// Handle a specific exception
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(
			ResourceNotFoundException ex, HttpServletRequest request) {
		String message = ex.getMessage();
		return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<?> handleEntityNotFoundException(
			EntityNotFoundException exception, HttpServletRequest request) {
		final Map<String, Object> body = new HashMap<>();
		body.put("status", HttpServletResponse.SC_NOT_FOUND);
		body.put("error", "Object not found");
		body.put("message", exception.getMessage());
		body.put("path", request.getRequestURI());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}


	@ExceptionHandler(NoResourceFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ResponseEntity<?> handleResourceNotFoundException(
			NoResourceFoundException ex, HttpServletRequest request) {
		final Map<String, Object> body = new HashMap<>();
		body.put("status", HttpStatus.NOT_FOUND);
		body.put("error", "Resource api not found");
		body.put("message", ex.getMessage());
		body.put("path", request.getContextPath());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}

	// Handle all other exceptions
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGlobalException(Exception ex, HttpServletRequest request) {

		String message = "An unexpected error occurred: " + ex.getMessage();
		return new ResponseEntity<>(new ErrorDTO(request.getRequestURI(),
				"Internal Server Error",
				HttpStatus.INTERNAL_SERVER_ERROR,
				message)
				, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}