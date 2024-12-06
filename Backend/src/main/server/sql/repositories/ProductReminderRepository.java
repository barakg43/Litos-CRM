package main.server.sql.repositories;

import main.server.sql.dto.reminder.ProductReminderRecord;
import main.server.sql.entities.ProductReminderEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Repository
public interface ProductReminderRepository extends JpaRepository<ProductReminderEntity, BigDecimal> {
//	SELECT     TOP 100 PERCENT *
////	FROM         dbo.tbSystemsDetails
////	WHERE     (ValidityTill < DATEADD(month, 2, @Date))
////	ORDER BY ValidityTill

	List<ProductReminderEntity> findAllByValidityTillBetweenOrderByValidityTillAsc(Timestamp minValidityTill,
																				   Timestamp maxValidityTill,
																				   Pageable pageable);

	@Query("SELECT new main.server.sql.dto.reminder.ProductReminderRecord(p.customerID, " +
			" p.customer.customerShortName, " +
			" p.id, " +
			" p.productDetailDescription, " +
			" p.notes1, " +
			" p.notes2, " +
			" p.notes3, " +
			" p.notes3, " +
			" p.price, " +
			" p.validityTill) FROM ProductReminderEntity p WHERE p.customerID = :customerID" +
			" ORDER BY p.validityTill DESC NULLS LAST")
	List<ProductReminderRecord> findAllByCustomer_CustomerID(Short customerID,
															 Pageable pageable);


	long countAllByValidityTillBetween(Timestamp minValidityTill, Timestamp maxValidityTill);

	long countAllByCustomer_CustomerID(Short customerID);
}

