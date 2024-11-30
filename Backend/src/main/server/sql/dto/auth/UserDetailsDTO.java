package main.server.sql.dto.auth;

import java.util.Date;

public record UserDetailsDTO(String username, String fullName, String email, Date createAt) {
}
