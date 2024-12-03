package main.server.http.controllers;

import main.server.sql.dto.auth.UserDetailsDTO;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.UserService;
import main.server.user.UpdateUserSecurityPropertiesRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
		UserEntity currentUser = UserService.getCurrentlyAuthenticatedUser();
		return ResponseEntity.ok(new UserDetailsDTO(currentUser));
	}

	@GetMapping("/")
	public ResponseEntity<List<UserEntity>> allUsers() {
		List<UserEntity> users = userService.allUsers();

		return ResponseEntity.ok(users);
	}

	@PreAuthorize("hasAnyRole('ADMIN')")
	@PostMapping("/update-security-props")
	public void updateSecurityPropertiesForUser(@RequestBody UpdateUserSecurityPropertiesRequest updateUserSecurityPropertiesRequest) {

		userService.updateUserSecurityProperties(updateUserSecurityPropertiesRequest);
	}
}
