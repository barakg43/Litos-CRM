package main.server.sql.dto.auth;

public record LoginResponse(String token, long expiresIn) {
}
