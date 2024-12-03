package main.server.sql.dto.auth;

import lombok.Data;
import main.server.sql.entities.UserEntity;
import main.server.user.Role;

import java.util.Date;

@Data
public class UserDetailsDTO {
	String username;
	String fullName;
	String email;
	Date createdAt;
	Role role;

	public UserDetailsDTO(UserEntity userEntity) {
		this.username = userEntity.getUsername();
		this.fullName = userEntity.getFullName();
		this.email = userEntity.getEmail();
		this.createdAt = userEntity.getCreatedAt();
		this.role = userEntity.getRole();
	}
}
