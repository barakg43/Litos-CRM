package main.server.config.security;


import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import main.server.ServerConstants;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {
	private final Logger requestLogger;
	//	@Value("${security.jwt.expiration-time}")
	private final long jwtExpirationMs = SecurityConstants.AUTH_COOKIE_ACCESS_MAX_AGE * 1000;
	@Value("${security.jwt.secret-key}")
	private String secretKey;

	public JwtService() {
		this.requestLogger = LogManager.getLogger(ServerConstants.REQUEST_LOGGER_NAME);
	}

	//
//	private String buildToken(
//			Map<String, Object> extraClaims,
//			UserDetails userDetails,
//			long expiration
//	) {
//		return Jwts
//				.builder()
//				.setClaims(extraClaims)
//				.setSubject(userDetails.getUsername())
//				.setIssuedAt(new Date(System.currentTimeMillis()))
//				.setExpiration(new Date(System.currentTimeMillis() + expiration))
//				.signWith(getSignInKey(), SignatureAlgorithm.HS256)
//				.compact();
//	}
//
//	public boolean isTokenValid(String token, UserDetails userDetails) {
//		final String username = extractUsername(token);
//		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
//	}
//
//	private boolean isTokenExpired(String token) {
//		return extractExpiration(token).before(new Date());
//	}
//
//	private Date extractExpiration(String token) {
//		return extractClaim(token, Claims::getExpiration);
//	}
//
//	private Claims extractAllClaims(String token) {
//
//		try {
//			Jwt<Claims> parse = Jwts.parser().verifyWith(getSignInKey()).build()
//					.parse(token).accept(Jwt.);
//		} catch (Exception e) {
//			LOGGER.error("Could not get all claims Token from passed token");
//			claims = null;
//		}
//		return claims;
//	}
	public static String generateKey() {

		// Generate a key using the JJWT library specifically for HMAC SHA-256
		SecretKey key = Jwts.SIG.HS256.key().build();
		// Encode the key to a Base64 string for easier handling
		return Base64.getEncoder().encodeToString(key.getEncoded());
	}

	//	public String extractUsername(String token) {
//		return extractClaim(token, Claims::getSubject);
//	}
//
//	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//		final Claims claims = extractAllClaims(token);
//		return claimsResolver.apply(claims);
//	}
//
//	public String generateToken(UserDetails userDetails) {
//		return generateToken(new HashMap<>(), userDetails);
//	}
//
//	public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
//		return buildToken(extraClaims, userDetails, jwtExpiration);
//	}
//
	public long getExpirationTime() {
		return jwtExpirationMs;
	}

	private SecretKey getSignInKey() {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
		return key;
	}

	public String getJwtFromHeader(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
//		logger.debug("Authorization Header: {}", bearerToken);
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7); // Remove Bearer prefix
		}
		return null;
	}

	public String generateTokenFromUsername(UserDetails userDetails) {
		String username = userDetails.getUsername();
		return Jwts.builder()
				.subject(username)
				.issuedAt(new Date())
				.expiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(getSignInKey())
				.compact();
	}

	public String getUsernameFromJwtToken(String token) {
		return Jwts.parser()
				.verifyWith(getSignInKey())
				.build().
				parseSignedClaims(token)
				.getPayload()
				.getSubject();
	}


	public boolean validateJwtToken(String authToken) {
		try {
			System.out.println("Validate");
			Jwts.parser()
					.verifyWith(getSignInKey())
					.build()
					.parseSignedClaims(authToken);
			return true;
		} catch (MalformedJwtException e) {
			requestLogger.error("Invalid JWT token: {}", e.getMessage());
		} catch (ExpiredJwtException e) {
			requestLogger.error("JWT token is expired: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			requestLogger.error("JWT token is unsupported: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			requestLogger.error("JWT claims string is empty: {}", e.getMessage());
		}
		return false;
	}
}
