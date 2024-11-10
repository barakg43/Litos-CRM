package main.server.sql.repositories;

import main.server.sql.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Integer> {
	Optional<UserEntity> findByUsername(String username);

	Optional<UserEntity> findById(Integer id);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);
}

