package main.server.config.security;

public class SecurityConstants {
	public static final String AUTH_ACCESS_KEY = "access-token";
	public static final String AUTH_REFRESH_KEY = "refresh-token";
	public static final int AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 5; //in Seconds
	public static final int AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24;//in Seconds
	public static final String[] CORS_ALLOWED_ORIGINS = {"*", "http://localhost:3000"};

}
