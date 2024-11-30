package main.server.http.controllers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class GlobalEndpointsController {
	private static final Logger logger = LogManager.getLogger("restartedMain");
	private final String healthResponse = String.format("{\"boot-time\":\"%s\"}",
			LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm:ss")));

	public static String printPWD() {
		String currentPath = null;
		String massage = null;
		try {
			currentPath = new java.io.File(".").getCanonicalPath();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		massage = "Current dir:" + currentPath;
		logger.info(massage);
		return massage;
	}

	@RequestMapping(value = "/{path:[^\\.]*}")
	public String forward(@PathVariable String path) {
		return getSpaApplication();
	}

	@GetMapping("/")
	public String getSpaApplication() {
		return "forward:/index.html";
	}

	@GetMapping("/api/health")
	public ResponseEntity<String> getServerHealth() {
		return new ResponseEntity<>(healthResponse, null, 200);
	}

	@GetMapping("/get-pwd")
	public String getTest() {
		System.out.println("test!");
		return printPWD();
	}

}