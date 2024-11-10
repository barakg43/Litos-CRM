package main.server.sql.repositories;


import jakarta.transaction.Transactional;
import main.server.sql.entities.RefreshTokenEntity;
import main.server.sql.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
	Optional<RefreshTokenEntity> findByToken(String token);

	@Transactional
	int deleteByUser(UserEntity user);


	void deleteByExpiryDateBefore(Timestamp currentDay);
}