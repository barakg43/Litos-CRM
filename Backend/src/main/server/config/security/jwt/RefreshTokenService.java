package main.server.config.security.jwt;


import jakarta.persistence.EntityNotFoundException;
import main.server.sql.entities.RefreshTokenEntity;
import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.RefreshTokenRepository;
import main.server.sql.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
	@Value("${bezkoder.app.jwtRefreshExpirationMs}")
	private Long refreshTokenDurationMs;

	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

	@Autowired
	private UserRepository userRepository;

	public Optional<RefreshTokenEntity> findByToken(String token) {
		return refreshTokenRepository.findByToken(token);
	}

	public RefreshTokenEntity createRefreshToken(Integer userId) {
		RefreshTokenEntity refreshToken = new RefreshTokenEntity();
		Timestamp expiryDate = Timestamp.from(Instant.now().plusMillis(refreshTokenDurationMs));
		Optional<UserEntity> optionalUser = userRepository.findById(userId);
		if (optionalUser.isEmpty())
			throw new EntityNotFoundException("User not found");
		refreshToken.setUser(optionalUser.get());
		refreshToken.setExpiryDate(expiryDate);
		refreshToken.setToken(UUID.randomUUID().toString());

		refreshToken = refreshTokenRepository.save(refreshToken);
		return refreshToken;
	}

	public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
		if (token.getExpiryDate().compareTo(Timestamp.from(Instant.now())) < 0) {
			refreshTokenRepository.delete(token);
			throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin " +
					"request");
		}

		return token;
	}

	@Transactional
	public int deleteByUserId(Integer userId) {
		if (!userRepository.existsById(userId))
			throw new EntityNotFoundException("User not found");
		return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
	}
}