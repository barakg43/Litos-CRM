package main.server.http.controllers;

import jakarta.servlet.http.HttpServletRequest;
import main.server.config.security.jwt.JwtService;
import main.server.config.security.jwt.RefreshTokenService;
import main.server.config.security.jwt.TokenCookie;
import main.server.config.security.jwt.TokenRefreshException;
import main.server.sql.dto.ErrorDTO;
import main.server.sql.dto.auth.LoginUserRecord;
import main.server.sql.dto.auth.RegisterUserDto;
import main.server.sql.dto.auth.TokenRecord;
import main.server.sql.entities.RefreshTokenEntity;
import main.server.sql.entities.UserEntity;
import main.server.sql.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
@Controller
public class AuthenticationController {
	private final JwtService jwtService;
	private final AuthenticationService authenticationService;
	@Autowired
	RefreshTokenService refreshTokenService;

	public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
		this.jwtService = jwtService;
		this.authenticationService = authenticationService;
	}

	@PostMapping("/signup")
	public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
		if (authenticationService.isUsernameExists(registerUserDto.username())) {
			return ResponseEntity
					.status(HttpStatus.CONFLICT)
					.body(new ErrorDTO("/auth/signup",
							"Username already exists",
							HttpStatus.CONFLICT, String.format(
							"Username '%s' already in use. please use another or login with existing account",
							registerUserDto.username()
					)));
		}

		if (authenticationService.isEmailExists(registerUserDto.email())) {
			return ResponseEntity
					.status(HttpStatus.CONFLICT)
					.body(new ErrorDTO(
							"/auth/signup",
							"Email already exists",
							HttpStatus.CONFLICT,
							String.format(
									"Email '%s' already in use.please use another or login with existing account",
									registerUserDto.email()
							)));
		}
		UserEntity registeredUser = authenticationService.signup(registerUserDto);

		return ResponseEntity.ok(registeredUser);
	}

	@PostMapping("/login")
	public ResponseEntity<UserEntity> authenticate(@RequestBody LoginUserRecord loginUserDto) {
		UserEntity authenticatedUser = authenticationService.authenticate(loginUserDto);

		String accessToken = new TokenCookie(
				TokenCookie.eType.ACCESS, jwtService.generateTokenFromUsername(authenticatedUser))
				.buildRawCookie();
		TokenRecord refreshTokenEntity = refreshTokenService.createRefreshToken(authenticatedUser.getId());

		Instant expiryDate = refreshTokenEntity.expiryDate().toInstant();

		String refreshTokenCookie = TokenCookie.buildCookie(TokenCookie.eType.REFRESH,
				refreshTokenEntity.token(),
				expiryDate).toString();
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, accessToken)
				.header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
				.build();
	}

//	@PostMapping("/signout")
//	public ResponseEntity<?> logoutUser() {
//		Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//
//		if (!Objects.equals(principle.toString(), "anonymousUser")) {
//			Integer userId = ((UserEntity) principle).getId();
//			refreshTokenService.deleteByUserId(userId);
//		}
//		ResponseCookie jwtCookie = TokenCookie.createCleanCookie(TokenCookie.eType.ACCESS);
//		ResponseCookie jwtRefreshCookie = TokenCookie.createCleanCookie(TokenCookie.eType.REFRESH);
//
//		return ResponseEntity.ok()
//				.header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
//				.header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
//				.body("You've been signed out!");
//	}

	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
		Optional<ResponseCookie> optionalResponseCookie = TokenCookie.extractCookieFromRequest(request,
				TokenCookie.eType.REFRESH);
		if (optionalResponseCookie.isPresent()) {
			return refreshTokenService.findByToken(optionalResponseCookie.get().getValue())
					.map(refreshTokenService::verifyExpiration)
					.map(RefreshTokenEntity::getUser)
					.map(user -> {
						String jwtCookie = new TokenCookie(TokenCookie.eType.ACCESS,
								jwtService.generateTokenFromUsername(user)).buildRawCookie();
						return ResponseEntity.ok()
								.header(HttpHeaders.SET_COOKIE, jwtCookie)
								.body("Token is refreshed successfully!");
					})
					.orElseThrow(() -> new TokenRefreshException(optionalResponseCookie.get().getValue(),
							"Refresh token is not valid! Please sign in again."));
		}

		return ResponseEntity.badRequest().body(new ErrorDTO("/auth/refresh-token", "Refresh token not found",
				HttpStatus.BAD_REQUEST, "Refresh token is missing from request"));
	}
}

