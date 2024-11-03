package main.server.sql.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "tbRefreshTokens")
@Getter
@Setter
public class RefreshTokenEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(columnDefinition = "decimal")
	private long id;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private UserEntity user;

	@Column(nullable = false, unique = true)
	private String token;

	@Column(nullable = false)
	private Timestamp expiryDate;

	//getters and setters

}