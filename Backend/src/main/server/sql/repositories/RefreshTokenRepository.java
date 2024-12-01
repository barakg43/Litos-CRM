package main.server.sql.repositories;


import jakarta.transaction.Transactional;
import main.server.sql.entities.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
	Optional<RefreshTokenEntity> findByTokenAndUserId(String token, Integer userId);

	@Transactional
	int deleteByUserId(Integer userId);


	void deleteByExpiryDateBefore(Timestamp currentDay);
}