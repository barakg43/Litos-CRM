package main.server.sql.dto.reminder;

import main.server.sql.entities.CustomerEntity;
import main.server.sql.entities.ProductReminderEntity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Optional;

public record ProductReminderRecord(Short customerID,
									String custShortName,
									BigDecimal systemDetailID,
									String productDetailDescription,
									String notes1,
									String notes2,
									String notes3,
									String notes4,
									Integer price,
									Timestamp validityTill) {
	public static ProductReminderRecord convertFromEntity(ProductReminderEntity productReminderEntity) {
		Optional<CustomerEntity> customerOptional = Optional.ofNullable(productReminderEntity.getCustomer());

		Short customerID = customerOptional.map(CustomerEntity::getCustomerID).orElse(null);
		String customerShortName = customerOptional.map(CustomerEntity::getCustomerShortName).orElse("");
		return new ProductReminderRecord(customerID,
				customerShortName,
				productReminderEntity.getId(),
				productReminderEntity.getProductDetailDescription(),
				productReminderEntity.getNotes1(),
				productReminderEntity.getNotes2(),
				productReminderEntity.getNotes3(),
				productReminderEntity.getNotes4(),
				productReminderEntity.getPrice(),
				productReminderEntity.getValidityTill());


	}
}