package main.server.sql.entities;

import jakarta.persistence.*;
import lombok.Getter;
import main.server.user.Role;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Date;
import java.util.Collection;
import java.util.List;

@Table(name = "tbUsers")
@Entity
public class UserEntity implements UserDetails {
	@Getter
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Integer id;
	@Column(nullable = false, length = 20, unique = true)
	private String username;
	@Getter
	@Column(nullable = false)
	private String fullName;
	@Getter
	@Column(unique = true, length = 100, nullable = false)
	private String email;
	@Column(nullable = false)
	private String password;
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(nullable = false)
	private boolean enabled;
	@CreationTimestamp
	@Getter

	@Column(updatable = false, columnDefinition = "smalldatetime")
	private Date createdAt;
	@UpdateTimestamp
	@Column(columnDefinition = "smalldatetime")
	private Date updatedAt;

	public UserEntity(String username, String fullName, String email, String password) {
		this.username = username;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.enabled = true;
		this.role = Role.USER;
	}

	public UserEntity() {

	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return role.getAuthorities();
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}


	@Override
	public boolean isEnabled() {
		return enabled;
	}

	// Getters and setters
}