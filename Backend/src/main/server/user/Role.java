package main.server.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

@RequiredArgsConstructor
public enum Role {

	USER,
	ADMIN;

//  @Getter
//  private final Set<Permission> permissions;

	public List<SimpleGrantedAuthority> getAuthorities() {
		return null;
	}
}
