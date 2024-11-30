package main.server.config.security;

import main.server.config.security.jwt.AuthEntryPointJwt;
import main.server.config.security.jwt.JwtAuthenticationFilter;
import main.server.config.security.jwt.JwtService;
import main.server.config.security.jwt.RefreshTokenService;
import main.server.sql.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	private final UserRepository userRepository;
	private final HandlerExceptionResolver handlerExceptionResolver;
	private final JwtService jwtService;
	private final RefreshTokenService refreshTokenService;
	private final AuthEntryPointJwt unauthorizedHandler;

	public SecurityConfig(UserRepository userRepository,
						  HandlerExceptionResolver handlerExceptionResolver,
						  JwtService jwtService,
						  RefreshTokenService refreshTokenService,
						  AuthEntryPointJwt unauthorizedHandler) {
		this.userRepository = userRepository;
		this.handlerExceptionResolver = handlerExceptionResolver;
		this.jwtService = jwtService;
		this.refreshTokenService = refreshTokenService;
		this.unauthorizedHandler = unauthorizedHandler;
	}

	public JwtAuthenticationFilter authenticationJwtTokenFilter() {
		return new JwtAuthenticationFilter(jwtService,
				handlerExceptionResolver, userDetailsService());
	}

	@Bean
	UrlBasedCorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(SecurityConstants.CORS_ALLOWED_ORIGINS));
		configuration.setAllowedMethods(Arrays.asList("POST", "GET", "DELETE", "PUT", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
				"Accept", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	@Bean
	@Order(1)
	UserDetailsService userDetailsService() {
		return username -> userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	@Bean
	@Order(2)
	public DefaultSecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(customizer -> customizer.configurationSource(corsConfigurationSource()))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api-docs/**").permitAll()
						.requestMatchers("/swagger-ui/**").permitAll()
						.requestMatchers("/", "/index.html").permitAll()
						.requestMatchers("/assets/**", "/locales/**").permitAll()
						.anyRequest().authenticated()
				)
				.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
				.logout(logout -> logout
						.logoutUrl("/api/auth/signout")
						.addLogoutHandler(refreshTokenService.getLogoutHandler())
						.logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
				)
				.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.formLogin(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable);
		http.authenticationProvider(authenticationProvider());
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}


}
