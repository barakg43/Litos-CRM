package main.server.config.security.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import main.server.config.security.SecurityConstants;
import org.springframework.http.ResponseCookie;
import org.springframework.lang.NonNull;

import java.util.Optional;

public class TokenCookie {

	private final Integer ageInSeconds;
	eType type;
	String token;

	public TokenCookie(eType type, String token) {
		this.type = type;
		this.token = token;
		this.ageInSeconds = null;
	}

	public TokenCookie(eType type, String token, Integer ageInSeconds) {
		this.type = type;
		this.token = token;
		this.ageInSeconds = ageInSeconds;
	}

	public static Optional<ResponseCookie> extractCookieFromRequest(@NonNull HttpServletRequest request,
																	@NonNull eType type) {
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(type.getName())) {


				return Optional.of(TokenCookie.buildCookie(cookie.getName(), cookie.getValue(), cookie.getMaxAge()));
			}
		}
		return Optional.empty();
	}

	public static ResponseCookie buildCookie(String name, String token, int ageInSeconds) {
		return ResponseCookie
				.from(name, token)
				.httpOnly(SecurityConstants.AUTH_COOKIE_HTTP_ONLY)
				.secure(SecurityConstants.AUTH_COOKIE_SECURE)
				.path(SecurityConstants.AUTH_COOKIE_PATH)
				.maxAge(ageInSeconds)
				.sameSite(SecurityConstants.AUTH_COOKIE_SAMESITE)
//				.domain("example.com")
				.build();
	}

	public ResponseCookie buildCookie() {
		return buildCookie(type.getName(), this.token, type.getAge());
	}

	public String buildRawCookie() {
		return buildCookie().toString();
	}

	@Getter
	public enum eType {
		ACCESS(SecurityConstants.AUTH_ACCESS_KEY, SecurityConstants.AUTH_COOKIE_ACCESS_MAX_AGE),
		REFRESH(SecurityConstants.AUTH_REFRESH_KEY, SecurityConstants.AUTH_COOKIE_REFRESH_MAX_AGE);

		private final String name;
		final private int age;

		eType(String name, int age) {
			this.name = name;
			this.age = age;
		}
	}
}
