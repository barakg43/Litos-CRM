package main.server.sql.dto.auth;

import main.server.sql.entities.UserEntity;

import java.util.Date;

public record UserDetailsDTO(String username, String fullName, String email, Date createAt) {
	public UserDetailsDTO(UserEntity userEntity) {
		this(userEntity.getUsername(), userEntity.getFullName(), userEntity.getEmail(), userEntity.getCreatedAt());
	}
}
