package main.server.config.security;

public class SecurityConstants {
	public static final String AUTH_ACCESS_KEY = "access-token";
	public static final String AUTH_REFRESH_KEY = "refresh-token";
	public static final int AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 5; //in Seconds
	public static final int AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24;//in Seconds
	public static final String[] CORS_ALLOWED_ORIGINS = {"http://localhost:3000", "http://localhost:5173"};
	public static final String AUTH_COOKIE_DOMAIN = "localhost";
	public static final boolean AUTH_COOKIE_SECURE = false;
	public static final boolean AUTH_COOKIE_HTTP_ONLY = true;
	public static final String AUTH_ACCESS_TOKEN_COOKIE_PATH = "/quik/api";
	public static final String AUTH_REFRESH_TOKEN_COOKIE_PATH = "/quik/api/auth";
	public static final String AUTH_COOKIE_SAMESITE = "Strict";
//	AUTH_COOKIE_SECURE = getenv("AUTH_COOKIE_SECURE", "True") == "True"
//	AUTH_COOKIE_HTTP_ONLY = True
//			AUTH_COOKIE_PATH = "/"
//	AUTH_COOKIE_SAMESITE = "None"

}
