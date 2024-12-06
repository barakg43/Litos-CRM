package main.server.sql.services;

import main.server.sql.dto.reminder.RemindersAmount;
import main.server.sql.repositories.ProductReminderRepository;
import main.server.sql.repositories.ServiceContractRepository;
import main.server.uilities.UtilityFunctions;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class GeneralService {
	private final ServiceContractRepository serviceContractRepository;
	private final ProductReminderRepository productReminderRepository;


	public GeneralService(ServiceContractRepository serviceContractRepository,
						  ProductReminderRepository productReminderRepository) {
		this.serviceContractRepository = serviceContractRepository;
		this.productReminderRepository = productReminderRepository;
	}

	public RemindersAmount getReminderAmount(int daysBeforeExpirationService,
											 int daysBeforeExpirationProduct,
											 int monthsAfterExpiration) {

		Timestamp startDate = UtilityFunctions.postDateByMonthAmountFromToday(-monthsAfterExpiration);
		Timestamp finishDateService = UtilityFunctions.postDateByDaysAmountFromToday(daysBeforeExpirationService);
		Timestamp finishDateProduct = UtilityFunctions.postDateByDaysAmountFromToday(daysBeforeExpirationProduct);
		long serviceReminderAmount =
				serviceContractRepository.countByRenewedFalseAndFinishDateOfContractBetween(startDate,
						finishDateService);
		long productReminderAmount = productReminderRepository.countAllByValidityTillBetween(startDate,
				finishDateProduct);
		return new RemindersAmount(serviceReminderAmount, productReminderAmount);
	}
}
