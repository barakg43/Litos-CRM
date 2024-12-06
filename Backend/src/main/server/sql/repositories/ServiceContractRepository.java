package main.server.sql.repositories;

import main.server.sql.dto.reminder.ContractRecord;
import main.server.sql.entities.CustomerEntity;
import main.server.sql.entities.ServiceContractEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface ServiceContractRepository extends JpaRepository<ServiceContractEntity, Long> {

	ServiceContractEntity getContractByContractID(long contractID);

	@Query("SELECT new main.server.sql.dto.reminder.ContractRecord(c.contractID, c.customerID, c.customer" +
			".customerShortName, " +
			"c.startDateOfContract, c.finishDateOfContract, c.contractPrice, c.periodKind, c.contractDescription) " +
			" FROM ServiceContractEntity c WHERE c.renewed = false AND c.finishDateOfContract >= ?1 AND c" +
			".finishDateOfContract <= ?2"
			+ " ORDER BY c.finishDateOfContract ASC")
	List<ContractRecord> getAllContractsRenewReminderInPeriodTime(Timestamp minimumDate, Timestamp expirationDate);

	List<ServiceContractEntity> findAllByRenewedIsFalseAndFinishDateOfContractBetweenOrderByFinishDateOfContractAsc(Timestamp startDate,
																													Timestamp endDate,
																													Pageable pageable);

	void deleteByContractID(Long contactID);

	List<ServiceContractEntity> findAllByCustomerOrderByStartDateOfContractDesc(CustomerEntity customer,
																				Pageable pageable);

	long countByRenewedFalseAndFinishDateOfContractBetween(Timestamp finishDateOfContractStart,
														   Timestamp finishDateOfContractEnd);

	long countByCustomer(CustomerEntity customer);
}
