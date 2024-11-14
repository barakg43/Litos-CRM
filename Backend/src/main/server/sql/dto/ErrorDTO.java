package main.server.sql.dto;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ErrorDTO {
	private final String path;
	private final String title;
	private final int status;
	private final String message;

	public ErrorDTO(String path, String title, HttpStatus status, Exception exception) {
		this.path = path;
		this.title = title;
		this.status = status.value();
		this.message = exception.getMessage();
	}

	public ErrorDTO(String path, String title, HttpStatus status, String message) {
		this.path = path;
		this.title = title;
		this.status = status.value();
		this.message = message;
	}
}
