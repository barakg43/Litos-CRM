package main.server.config.security.jwt;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.AeadAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import main.server.config.security.SecurityConstants;
import main.server.sql.dto.auth.TokenRecord;
import main.server.sql.entities.RefreshTokenEntity;
import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.RefreshTokenRepository;
import main.server.sql.repositories.UserRepository;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

	private final SecretKey userSecretKey;
	private final AeadAlgorithm aeadAlgorithm = Jwts.ENC.A256GCM;
	@Autowired
	private RefreshTokenRepository refreshTokenRepository;
	@Autowired
	private UserRepository userRepository;
	private MessageDigest tokenHarsher;

	public RefreshTokenService() {
		this.userSecretKey = aeadAlgorithm.key().build();
	}

	public Optional<RefreshTokenEntity> findByToken(String originalCombinedToken) {
		Pair<Integer, String> tokenUserIdPair = splitTokenWithUserId(originalCombinedToken);
		Integer userId = tokenUserIdPair.a;
		String hashedToken = generateHashedString(tokenUserIdPair.b);
		return refreshTokenRepository.findByTokenAndUserId(hashedToken, userId);
	}

	@PostConstruct
	private void initMessageDigest() {
		try {
			tokenHarsher = MessageDigest.getInstance("SHA3-256");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String generateHashedString(String original) {
		byte[] hash = tokenHarsher.digest(original.getBytes(StandardCharsets.UTF_8));
		return Base64.getEncoder().encodeToString(hash);

	}

	private String generateRandomToken() {
		return UUID.randomUUID().toString();
	}

	public LogoutHandler getLogoutHandler() {
		return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {
			Optional<ResponseCookie> optionalRefreshCookie = TokenCookie.extractCookieFromRequest(request,
					TokenCookie.eType.REFRESH);
			boolean isLogoutAllDevices = request.getParameter("all") != null
					&& request.getParameter("all").equals("true");
			if (isLogoutAllDevices) {
				handleLogoutAllDevice(optionalRefreshCookie);
			} else {
				handleLogoutOneDevice(optionalRefreshCookie);
			}
			response.addCookie(TokenCookie.createCleanCookie(TokenCookie.eType.REFRESH));
			response.addCookie(TokenCookie.createCleanCookie(TokenCookie.eType.ACCESS));
		};
	}

	private void handleLogoutAllDevice(Optional<ResponseCookie> optionalRefreshCookie) {
		try {
			optionalRefreshCookie.map(ResponseCookie::getValue)
					.map(this::findByToken)
					.flatMap(optionalToken ->
							optionalToken.map(RefreshTokenEntity::getUser))
					.map(this::deleteByUser)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token not found " +
							"or" +
							" user not found"));
		} catch (ResponseStatusException e) {
			throw e;
		} catch (NullPointerException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token not found or" +
					" user not found");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}

	private void handleLogoutOneDevice(Optional<ResponseCookie> optionalRefreshCookie) {
		try {
			optionalRefreshCookie.map(ResponseCookie::getValue)
					.flatMap(this::findByToken)
					.ifPresent(this::deleteByToken);
		} catch (NullPointerException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token not found!");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		}
	}


	public TokenRecord createRefreshToken(Integer userId) {
		RefreshTokenEntity refreshToken = new RefreshTokenEntity();
		int refreshTokenDurationSec = SecurityConstants.AUTH_COOKIE_REFRESH_MAX_AGE;
		Timestamp expiryDate = Timestamp.from(Instant.now().plusSeconds(refreshTokenDurationSec));
		Optional<UserEntity> optionalUser = userRepository.findById(userId);
		if (optionalUser.isEmpty())
			throw new EntityNotFoundException("User not found");
		refreshToken.setUser(optionalUser.get());
		refreshToken.setExpiryDate(expiryDate);
		String originalToken = generateRandomToken();
		String hashedToken = generateHashedString(originalToken);
		String tokenWithEncryptUserID = combineTokenWithUserId(originalToken, userId);
		refreshToken.setToken(hashedToken);
		refreshTokenRepository.save(refreshToken);
		return new TokenRecord(tokenWithEncryptUserID, expiryDate);
	}

	private String combineTokenWithUserId(String token, Integer userId) {
		String encryptUserId = encryptUserIdUsingJwe(userId);
		return String.format("%s:%s", encryptUserId, token);
	}

	private Pair<Integer, String> splitTokenWithUserId(String combinedTokenWithUserId) {
		String[] splitTokenUserid = combinedTokenWithUserId.split(":");
		Integer userId = decryptUserIdUsingJwe(splitTokenUserid[0]);
		return new Pair<>(userId, splitTokenUserid[1]);
	}

	public RefreshTokenEntity verifyExpiration(@NotNull RefreshTokenEntity token) {
		if (token.getExpiryDate().compareTo(Timestamp.from(Instant.now())) < 0) {
			refreshTokenRepository.delete(token);
			throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin " +
					"request");
		}

		return token;
	}

	private String encryptUserIdUsingJwe(Integer userID) {
		return Jwts.builder()
				.content(String.valueOf(userID), "text/plain")
				.encryptWith(userSecretKey,
						aeadAlgorithm)
				.compact();

	}

	private Integer decryptUserIdUsingJwe(String token) {
		try {

			return Integer.valueOf(new String(Jwts.parser()
					.decryptWith(userSecretKey)
					.build()
					.parseEncryptedContent(token)
					.getPayload(),
					StandardCharsets.UTF_8));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Transactional
	public int deleteByUser(@NotNull UserEntity user) {
		if (!userRepository.existsById(user.getId()))
			throw new EntityNotFoundException("User not found");
		return refreshTokenRepository.deleteByUserId(user.getId());
	}

	public void deleteByToken(@NotNull RefreshTokenEntity token) {
		if (!refreshTokenRepository.existsById(token.getId()))
			throw new EntityNotFoundException("Refresh token not found");
		refreshTokenRepository.delete(token);
	}
}