package main.server.config.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


	private final HandlerExceptionResolver handlerExceptionResolver;

	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtService jwtService, HandlerExceptionResolver handlerExceptionResolver,
								   UserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
		this.handlerExceptionResolver = handlerExceptionResolver;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) {
		final Optional<ResponseCookie> accessCookie = TokenCookie.extractCookieFromRequest(request,
				TokenCookie.eType.ACCESS);
		try {
			if (accessCookie.isEmpty()) {
				filterChain.doFilter(request, response);
				return;
			}
			final String jwt = accessCookie.map(ResponseCookie::getValue)
					.orElseThrow(() ->
							new RuntimeException("No JWT in cookie"));
			final String username = jwtService.getUsernameFromJwtToken(jwt);

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			if (username != null && authentication == null) {
				UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

				if (jwtService.validateJwtToken(jwt)) {
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
							userDetails,
							null,
							userDetails.getAuthorities()
					);

					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}

			filterChain.doFilter(request, response);
		} catch (Exception exception) {
			handlerExceptionResolver.resolveException(request, response, null, exception);
//			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
		}
	}


}
