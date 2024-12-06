package main.server.sql.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import main.server.sql.dto.reminder.ePeriodKind;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "tbCustomersContracts")
@Getter
@Setter
public class ServiceContractEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "decimal")
	private Long contractID;

	@Column(nullable = false)
	private Short customerID;

	@Column
	private Integer contactPersonID;

	@Column
	private Byte contractsKindID;

	@Column(nullable = false)
	private Timestamp startDateOfContract;

	@Column(nullable = false)
	private Timestamp finishDateOfContract;

	@Column(nullable = false)
	private BigDecimal contractPrice;

	@Column
	private Byte quantityOfMonths;

	@Column
	private Float coefficient;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private ePeriodKind periodKind;

	@Column
	private Byte number;

	@Size(max = 500)
	@Column
	private String contractDescription;

	@Column
	private Boolean renewed = false;

	@Column
	private Long reminderID;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customerID", referencedColumnName = "customerID", insertable = false, updatable = false)
	private CustomerEntity customer;

	// Constructors, getters, and setters
}

