package main.server.sql.services;


import jakarta.transaction.Transactional;
import main.server.sql.dto.ListSubset;
import main.server.sql.dto.reminder.ProductReminderRecord;
import main.server.sql.entities.ProductReminderEntity;
import main.server.sql.repositories.ProductReminderRepository;
import main.server.uilities.UtilityFunctions;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static main.server.uilities.UtilityFunctions.getPageObject;

@Service
public class ProductRenewService {

	private final ProductReminderRepository productReminderRepository;


	public ProductRenewService(ProductReminderRepository productReminderRepository) {
		this.productReminderRepository = productReminderRepository;
	}

	private static ProductReminderEntity getProductReminderEntity(ProductReminderRecord productReminderRecord,
																  Short customerID) {
		ProductReminderEntity newReminder = new ProductReminderEntity();
		newReminder.setCustomerID(customerID);
		newReminder.setProductDetailDescription(productReminderRecord.productDetailDescription());
		newReminder.setNotes1(productReminderRecord.notes1());
		newReminder.setNotes2(productReminderRecord.notes2());
		newReminder.setNotes3(productReminderRecord.notes3());
		newReminder.setNotes4(productReminderRecord.notes4());
		newReminder.setValidityTill(productReminderRecord.validityTill());
		return newReminder;
	}

	public ListSubset<ProductReminderRecord> getRenewalReminders(int daysBeforeExpiration, int monthsAfterExpiration,
																 Integer pageNumber,
																 Integer pageSize) {

		Pageable page = getPageObject(pageNumber, pageSize);
		Timestamp startDate = UtilityFunctions.postDateByMonthAmountFromToday(-monthsAfterExpiration);
		Timestamp finishDate = UtilityFunctions.postDateByDaysAmountFromToday(daysBeforeExpiration);
		List<ProductReminderRecord> productReminderEntityList =
				productReminderRepository
						.findAllByValidityTillBetweenOrderByValidityTillAsc(startDate, finishDate, page)
						.stream()
						.map(ProductReminderRecord::convertFromEntity)
						.toList();
		long totalAmountInDataBase =
				productReminderRepository.countAllByValidityTillBetween(startDate, finishDate);
		return new ListSubset<>(productReminderEntityList, totalAmountInDataBase);
	}

	public ListSubset<ProductReminderRecord> getProductRemindersForCustomer(Short customerID, Integer pageNumber,
																			Integer pageSize) {
		Pageable page = getPageObject(pageNumber, pageSize);
		List<ProductReminderRecord> productReminderEntityList =
				productReminderRepository.findAllByCustomer_CustomerID(customerID, page);
		long totalAmountInDataBase = productReminderRepository.countAllByCustomer_CustomerID(customerID);
		return new ListSubset<>(productReminderEntityList, totalAmountInDataBase);
	}

	@Transactional
	public void renewProductForPeriodTime(BigDecimal reminderId, ProductReminderRecord productReminderRecord) throws IndexOutOfBoundsException {
		Optional<ProductReminderEntity> productReminderEntityToRenewOptional =
				productReminderRepository.findById(reminderId);

		if (productReminderEntityToRenewOptional.isPresent()) {
			ProductReminderEntity currentProductReminder = productReminderEntityToRenewOptional.get();
			ProductReminderEntity newReminder = getProductReminderEntity(productReminderRecord,
					currentProductReminder.getCustomerID());
			currentProductReminder.setValidityTill(null);
			validAndSaveToRepository(currentProductReminder);
			validAndSaveToRepository(newReminder);
		} else
			throw new IndexOutOfBoundsException("Cannot find product reminder to renew with id of " + reminderId);
	}

	public BigDecimal addNewProductReminder(ProductReminderRecord productReminderRecord) {
		ProductReminderEntity newReminderEntity = new ProductReminderEntity();
		copyAllProductRecordPropertiesToEntity(productReminderRecord, newReminderEntity);
		ProductReminderEntity savedReminder = validAndSaveToRepository(newReminderEntity);
		return savedReminder.getId();
	}

	@Transactional
	public void removeProductReminder(BigDecimal id) throws IndexOutOfBoundsException {
		if (productReminderRepository.existsById(id))
			productReminderRepository.deleteById(id);
		else
			throw new IndexOutOfBoundsException();
	}


	@Transactional
	public void updateProductReminderData(BigDecimal reminderId, ProductReminderRecord productReminderRecord) throws IndexOutOfBoundsException {
		Optional<ProductReminderEntity> productReminderEntityToRenewOptional =
				productReminderRepository.findById(reminderId);

		if (productReminderEntityToRenewOptional.isPresent()) {
			ProductReminderEntity currentProductReminder = productReminderEntityToRenewOptional.get();
			copyAllProductRecordPropertiesToEntity(productReminderRecord, currentProductReminder);
			validAndSaveToRepository(currentProductReminder);
		} else
			throw new IndexOutOfBoundsException("Cannot find product reminder to update with id of " + productReminderRecord.systemDetailID());

	}

	private ProductReminderEntity validAndSaveToRepository(ProductReminderEntity productReminderEntity) throws IllegalArgumentException {
		UtilityFunctions.validEntityValidations(productReminderEntity);
		return productReminderRepository.save(productReminderEntity);
	}

	private void copyAllProductRecordPropertiesToEntity(ProductReminderRecord sourceRecord,
														ProductReminderEntity targetEntity) {
		targetEntity.setValidityTill(sourceRecord.validityTill());
		targetEntity.setNotes4(sourceRecord.notes4());
		targetEntity.setNotes1(sourceRecord.notes1());
		targetEntity.setNotes2(sourceRecord.notes2());
		targetEntity.setProductDetailDescription(sourceRecord.productDetailDescription());
		targetEntity.setNotes3(sourceRecord.notes3());
		targetEntity.setPrice(sourceRecord.price());
		if (sourceRecord.customerID() != null)
			targetEntity.setCustomerID(sourceRecord.customerID());


	}
}
