package main.server.http.controllers;

import main.server.sql.dto.auth.UserDetailsDTO;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.UserService;
import main.server.user.UpdateUserSecurityPropertiesRequest;
import main.server.user.UserSecurityProperties;
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

	@PreAuthorize("hasAnyRole('ADMIN')")
	@GetMapping("/")
	public List<UserSecurityProperties> allUsersSecurityProperties() {
		return userService.allUsers()
				.stream()
				.map(UserSecurityProperties::new)
				.toList();
	}

	@PreAuthorize("hasAnyRole('ADMIN')")
	@PostMapping("/update-security-props")
	public void updateSecurityPropertiesForUser(@RequestBody UpdateUserSecurityPropertiesRequest updateUserSecurityPropertiesRequest) {

		userService.updateUserSecurityProperties(updateUserSecurityPropertiesRequest);
	}
}
