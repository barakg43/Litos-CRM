package main.server.sql.dto.auth;

import java.sql.Timestamp;

public record TokenRecord(
		String token,
		Timestamp expiryDate) {
}
