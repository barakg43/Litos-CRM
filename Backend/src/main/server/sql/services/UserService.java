package main.server.sql.services;

import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
}