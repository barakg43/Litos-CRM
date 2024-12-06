package main.server.config.security.jwt;

import main.server.logger.LogLevel;
import main.server.logger.ServerLogManager;
import main.server.sql.repositories.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableScheduling
public class RefreshTokenScheduler {
	@Autowired
	@Lazy
	RefreshTokenRepository refreshTokenRepository;

	@Autowired
	ServerLogManager serverLogManager;

	@Transactional
	@Scheduled(fixedRate = 1, timeUnit = TimeUnit.DAYS, initialDelay = 1)
	protected void deleteAllExpiredRefreshToken() {
		long tokenAmountBefore = refreshTokenRepository.count();
		refreshTokenRepository.deleteByExpiryDateBefore(Timestamp.from(Instant.now()));
		long tokenAmountAfter = refreshTokenRepository.count();
		serverLogManager.addLogRecordSqlLogger(LogLevel.INFO,
				"deleted expired tokens: " + (tokenAmountBefore - tokenAmountAfter));

	}
}
