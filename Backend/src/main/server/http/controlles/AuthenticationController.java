package main.server.http.controlles;

import main.server.config.security.SecurityConstants;
import main.server.config.security.jwt.JwtService;
import main.server.config.security.jwt.TokenCookie;
import main.server.sql.dto.auth.LoginUserRecord;
import main.server.sql.dto.auth.RegisterUserDto;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {
	private final JwtService jwtService;

	private final AuthenticationService authenticationService;

	public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
		this.jwtService = jwtService;
		this.authenticationService = authenticationService;
	}

	@PostMapping("/signup")
	public ResponseEntity<UserEntity> register(@RequestBody RegisterUserDto registerUserDto) {
		UserEntity registeredUser = authenticationService.signup(registerUserDto);

		return ResponseEntity.ok(registeredUser);
	}

	@PostMapping("/login")
	public ResponseEntity<UserEntity> authenticate(@RequestBody LoginUserRecord loginUserDto) {
		UserEntity authenticatedUser = authenticationService.authenticate(loginUserDto);

		String accessToken = new TokenCookie(
				TokenCookie.eType.ACCESS, jwtService.generateTokenFromUsername(authenticatedUser))
				.buildRawCookie();
		
		return ResponseEntity.ok()
				.header(SecurityConstants.AUTH_ACCESS_KEY, accessToken)
				.build();
	}
}
