package main.server.http.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import main.server.config.security.jwt.JwtService;
import main.server.config.security.jwt.RefreshTokenService;
import main.server.config.security.jwt.TokenCookie;
import main.server.sql.dto.auth.LoginUserRecord;
import main.server.sql.dto.auth.RegisterUserDto;
import main.server.sql.entities.RefreshTokenEntity;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.Instant;

@RequestMapping("/api/auth")
@RestController
@Controller
public class AuthenticationController {
	private final JwtService jwtService;

	@Autowired
	RefreshTokenService refreshTokenService;
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
		RefreshTokenEntity refreshTokenEntity= refreshTokenService.createRefreshToken(authenticatedUser.getId());
		int ageInSeconds=refreshTokenEntity.getExpiryDate().getTime()-Instant.now().getEpochSecond();
		String refreshToken=new TokenCookie(TokenCookie.eType.REFRESH,refreshTokenEntity.getToken(),)
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, accessToken)
				.build();
	}
	@PostMapping("/refreshtoken")
	public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
		String requestRefreshToken = request.getRefreshToken();

		return refreshTokenService.findByToken(requestRefreshToken)
				.map(refreshTokenService::verifyExpiration)
				.map(RefreshTokenEntity::getUser)
				.map(user -> {
					String token = jwtUtils.generateTokenFromUsername(user.getUsername());
					return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
				})
				.orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
						"Refresh token is not in database!"));
	}
	@PostMapping("/signout")
	public ResponseEntity<?> logoutUser() {
		Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principle.toString() != "anonymousUser") {
			Long userId = ((UserDetailsImpl) principle).getId();
			refreshTokenService.deleteByUserId(userId);
		}

		ResponseCookie jwtCookie = jwtUtils.getCleanJwtCookie();
		ResponseCookie jwtRefreshCookie = jwtUtils.getCleanJwtRefreshCookie();

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
				.header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
				.body(new MessageResponse("You've been signed out!"));
	}

	@PostMapping("/refreshtoken")
	public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
		String refreshToken = TokenCookie.extractCookieFromRequest(request,);

		if ((refreshToken != null) && (refreshToken.length() > 0)) {
			return refreshTokenService.findByToken(refreshToken)
					.map(refreshTokenService::verifyExpiration)
					.map(RefreshToken::getUser)
					.map(user -> {
						ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user);

						return ResponseEntity.ok()
								.header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
								.body(new MessageResponse("Token is refreshed successfully!"));
					})
					.orElseThrow(() -> new TokenRefreshException(refreshToken,
							"Refresh token is not in database!"));
		}

		return ResponseEntity.badRequest().body(new MessageResponse("Refresh Token is empty!"));
	}
}
}
