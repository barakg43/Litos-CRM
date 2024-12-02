package main.server.sql.services;

import jakarta.persistence.EntityNotFoundException;
import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.UserRepository;
import main.server.user.UpdateUserSecurityPropertiesRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<UserEntity> allUsers() {
		List<UserEntity> users = new ArrayList<>();

		userRepository.findAll().forEach(users::add);

		return users;
	}

	public void updateUserSecurityProperties(UpdateUserSecurityPropertiesRequest securityPropertiesRequest) {
		String username = securityPropertiesRequest.getUsername();
		Optional<UserEntity> userToUpdateOptional = userRepository.findByUsername(username);
		UserEntity userToUpdate;
		boolean isUpdateAnyProperty = false;
		if (userToUpdateOptional.isEmpty())
			throw new EntityNotFoundException(String.format("cannot find user '%s'", username));
		userToUpdate = userToUpdateOptional.get();
		if (securityPropertiesRequest.getEnabled() != null) {
			userToUpdate.setEnabled(securityPropertiesRequest.getEnabled());
			isUpdateAnyProperty = true;
		}
		if (securityPropertiesRequest.getRole() != null) {
			userToUpdate.setRole(securityPropertiesRequest.getRole());
			isUpdateAnyProperty = true;
		}
		if (isUpdateAnyProperty) {
			userRepository.save(userToUpdate);
		}
	}
}