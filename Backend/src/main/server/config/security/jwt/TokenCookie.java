package main.server.config.security.jwt;

import lombok.Getter;
import main.server.config.security.SecurityConstants;
import org.springframework.http.ResponseCookie;

public class TokenCookie {

	eType type;
	String token;

	public TokenCookie(eType type, String token) {
		this.type = type;
		this.token = token;

	}


	public ResponseCookie buildCookie() {
		return ResponseCookie.from(type.getName(), token)
				.httpOnly(SecurityConstants.AUTH_COOKIE_HTTP_ONLY)
				.secure(SecurityConstants.AUTH_COOKIE_SECURE)
				.path(SecurityConstants.AUTH_COOKIE_PATH)
				.maxAge(type.getAge())
				.sameSite(SecurityConstants.AUTH_COOKIE_SAMESITE)
//				.domain("example.com")
				.build();
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
