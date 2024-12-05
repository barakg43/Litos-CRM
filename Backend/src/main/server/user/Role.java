package main.server.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public enum Role {

	USER,
	ADMIN;

	//  @Getter
//  private final Set<Permission> permissions;
	private static final String ROLE_PREFIX = "ROLE_";

	public List<SimpleGrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> list = new ArrayList<>();
		list.add(new SimpleGrantedAuthority(ROLE_PREFIX + this.name()));
		return list;
	}
}
