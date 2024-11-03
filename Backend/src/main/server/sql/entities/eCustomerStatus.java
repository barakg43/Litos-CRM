package main.server.sql.entities;


import lombok.Getter;

@Getter
public enum eCustomerStatus {
	IN_SERVICE("IN_SERVICE"),
	OUT_OF_SERVICE("OUT_OF_SERVICE"),
	BANK_HOURS("BANK_HOURS"),
	CLOUD_SERVER("CLOUD_SERVER"),
	CLOUD_MAIL("CLOUD_MAIL"),
	;


	private final String status;

	eCustomerStatus(String status) {
		this.status = status;

	}

	public static eCustomerStatus fromStatus(String status) {
		for (eCustomerStatus v : values())
			if (v.getStatus().equalsIgnoreCase(status)) return v;
		throw new IllegalArgumentException();
	}

	public String toString() {
		return status;
	}
}