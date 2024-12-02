package main.server.user;

import lombok.Data;

@Data
public class UpdateUserSecurityPropertiesRequest {
	private String username;
	private Role role;
	private Boolean enabled;
}