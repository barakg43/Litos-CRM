package main.server.user;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserSecurityPropertiesRequest {
	@NotNull
	private String username;
	@Nullable
	private Role role;
	@Nullable
	private Boolean enabled;
}