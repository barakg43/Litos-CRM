package main.server.http.controlles;

import main.server.sql.entities.UserEntity;
import main.server.sql.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/users")
@RestController
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<UserEntity> authenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		UserEntity currentUser = (UserEntity) authentication.getPrincipal();

		return ResponseEntity.ok(currentUser);
	}

	@GetMapping("/")
	public ResponseEntity<List<UserEntity>> allUsers() {
		List<UserEntity> users = userService.allUsers();

		return ResponseEntity.ok(users);
	}
}
