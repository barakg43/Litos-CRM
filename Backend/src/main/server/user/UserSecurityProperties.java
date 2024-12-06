package main.server.user;

import lombok.AllArgsConstructor;
import main.server.sql.entities.UserEntity;

import java.sql.Date;

@AllArgsConstructor
public class UserSecurityProperties {
	private String username;
	private String fullName;
	private Role role;
	private Boolean enabled;
	private Date createdAt;

	public UserSecurityProperties(UserEntity user) {
		this.username = user.getUsername();
		this.fullName = user.getFullName();
		this.role = user.getRole();
		this.enabled = user.isEnabled();
		this.createdAt = user.getCreatedAt();
	}

}
