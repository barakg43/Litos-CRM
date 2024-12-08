package main.server.http.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static main.server.uilities.UtilityFunctions.printPWD;

/**
 * Don't use @RestController annotation here.
 * this cause a bug in 'getSpaApplication' and  'forward' endpoints
 * this adds @ResponseBody to endpoints which return String instead doing a redirect command to index.html
 */
@Controller
public class GlobalEndpointsController {
	private final String healthResponse = String.format("{\"boot-time\":\"%s\"}",
			LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm:ss")));

	@RequestMapping(value = "/{path:[^\\.]*}")
	public String forward(@PathVariable String path) {
		return getSpaApplication();
	}

	@GetMapping("/")
	public String getSpaApplication() {
		return "forward:/index.html";
	}

	@GetMapping("mgmt/health")
	public ResponseEntity<String> getServerHealth() {
		return new ResponseEntity<>(healthResponse, null, 200);
	}

	@GetMapping("mgmt/get-pwd")
	public String getTest() {
		System.out.println("test!");
		return printPWD();
	}

}