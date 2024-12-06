package main.server.sql.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import main.server.sql.dto.customer.CustomerFullDetailsRecord;


@Entity
@Table(name = "tbCustomersDetails")
@Getter
@Setter
public class CustomerEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "smallint")
	private Short customerID;

	@Size(max = 50)
	@Column(nullable = false)
	private String customerShortName;

	@Size(max = 100)
	@Column(nullable = false)
	private String customerName;

	@Size(max = 9)
	@Column(columnDefinition = "nchar", length = 9)
	private String customerIdentificationNumber;

	@Column
	@Enumerated(EnumType.STRING)
	private eCustomerStatus customerStatus;

	@Size(max = 10)
	@Column(columnDefinition = "char", length = 10)
	private String customerMainPhone;

	@Size(max = 100)
	@Column
	private String customerMainEMail;

	@Lob
	@Column(columnDefinition = "nvarchar")
	private String remarks;

	@Column(columnDefinition = "decimal")
	private Long activeContractID;

	@Size(max = 80)
	@Column
	private String address;

	@Size(max = 50)
	@Column(columnDefinition = "nchar", length = 50)
	private String city;

	@Size(max = 7)
	@Column(columnDefinition = "char(7)", length = 7)
	private String postalCode;

	@Lob
	@Column(columnDefinition = "ntext")
	private String addressRemarks;

	@Size(max = 30)
	@Column(columnDefinition = "nchar", length = 30)
	private String contactPersonName;

	@Size(max = 50)
	@Column(columnDefinition = "nchar", length = 50)
	private String contactPersonPost;

	@Size(max = 10)
	@Column(columnDefinition = "char", length = 10)
	private String contactPersonPhone;

	@Size(max = 11)
	@Column(columnDefinition = "char", length = 11)
	private String contactPersonMobilePhone;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "activeContractID", referencedColumnName = "contractID", insertable = false, updatable = false)
	private ServiceContractEntity activeContract;

	public CustomerEntity() {
	}

	public CustomerEntity(CustomerFullDetailsRecord customerFullDetailsRecord) {
		copyFieldsFromCustomerRecord(customerFullDetailsRecord);
	}

	public void copyFieldsFromCustomerRecord(CustomerFullDetailsRecord customerFullDetailsRecord) {
		this.customerShortName = customerFullDetailsRecord.customerShortName();
		this.customerName = customerFullDetailsRecord.customerName();
		this.customerIdentificationNumber = customerFullDetailsRecord.customerIdentificationNumber();
		this.customerStatus = customerFullDetailsRecord.customerStatus();
		this.customerMainPhone = customerFullDetailsRecord.customerMainPhone();
		this.customerMainEMail = customerFullDetailsRecord.customerMainEMail();
		this.remarks = customerFullDetailsRecord.remarks();
		this.activeContractID = customerFullDetailsRecord.activeContractID();
		this.address = customerFullDetailsRecord.address();
		this.city = customerFullDetailsRecord.city();
		this.postalCode = customerFullDetailsRecord.postalCode();
		this.addressRemarks = customerFullDetailsRecord.addressRemarks();
		this.contactPersonName = customerFullDetailsRecord.contactPersonName();
		this.contactPersonPost = customerFullDetailsRecord.contactPersonPost();
		this.contactPersonPhone = customerFullDetailsRecord.contactPersonPhone();
		this.contactPersonMobilePhone = customerFullDetailsRecord.contactPersonMobilePhone();
	}

	// Constructors, getters, and setters
}
