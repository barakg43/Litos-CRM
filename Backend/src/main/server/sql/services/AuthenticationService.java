package main.server.sql.services;

import main.server.sql.dto.auth.LoginUserRecord;
import main.server.sql.dto.auth.RegisterUserDto;
import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;

	public AuthenticationService(
			UserRepository userRepository,
			AuthenticationManager authenticationManager,
			PasswordEncoder passwordEncoder
	) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserEntity signup(RegisterUserDto input) {
		UserEntity user = new UserEntity(input.fullName(), input.email(), passwordEncoder.encode(input.password()));

		return userRepository.save(user);
	}

	public UserEntity authenticate(LoginUserRecord input) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						input.email(),
						input.password()
				)
		);

		return userRepository.findByEmail(input.email())
				.orElseThrow();
	}
}
