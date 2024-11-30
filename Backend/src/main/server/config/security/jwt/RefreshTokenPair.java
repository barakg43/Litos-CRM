package main.server.config.security.jwt;

public class RefreshTokenPair {


	private final String refreshToken;
	private final Integer userId;

	public RefreshTokenPair(String refreshToken, Integer userId) {
		this.refreshToken = refreshToken;
		this.userId = userId;
	}

	public String generateCombinedTokenWithEncryptedUserId() {
		return refreshToken + ":" + userId;
	}
}
