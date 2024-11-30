package main.server.http.controllers;

import main.server.sql.dto.auth.UserDetailsDTO;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<UserDetailsDTO> authenticatedUserDetails() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		UserEntity currentUser = (UserEntity) authentication.getPrincipal();

		return ResponseEntity.ok(new UserDetailsDTO(currentUser));
	}

	@GetMapping("/")
	public ResponseEntity<List<UserEntity>> allUsers() {
		List<UserEntity> users = userService.allUsers();

		return ResponseEntity.ok(users);
	}
}
