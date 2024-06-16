package main.server.http.controlles.reminders;

import main.server.http.HttpRequestExecutor;
import main.server.sql.dto.reminder.ProductReminderRecord;
import main.server.sql.services.ProductRenewService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

import static main.server.ServerConstants.SERVER_CROSS_ORIGIN;

@CrossOrigin(origins = SERVER_CROSS_ORIGIN)
@RestController
@RequestMapping("/api/product-renews")
public class ProductReminderController {
	private final HttpRequestExecutor httpRequestExecutor;
	private final ProductRenewService productRenewService;

	public ProductReminderController(HttpRequestExecutor httpRequestExecutor,
									 ProductRenewService productRenewService) {
		this.httpRequestExecutor = httpRequestExecutor;
		this.productRenewService = productRenewService;
	}

	@GetMapping("/reminders")
	public List<ProductReminderRecord> getInvoiceReminders(@RequestParam int daysBeforeExpiration) {
		return httpRequestExecutor.executeHttpRequest(() -> productRenewService.getRenewalReminders(daysBeforeExpiration), "/api/reminders" +
				"/product-renews", HttpMethod.GET);
	}

	@GetMapping("/customer/{cstomerID}")
	public List<ProductReminderRecord> getProductRemindersForCustomer(@PathVariable Short customerID) {
		return httpRequestExecutor.executeHttpRequest(() -> productRenewService.getProductRemindersForCustomer
				(customerID), "/product-renews" +
				"/reminders/customer/" + customerID, HttpMethod.GET);
	}

	@PostMapping
	public BigDecimal addNewProductReminder(@RequestBody ProductReminderRecord productReminderRecord) {
		return httpRequestExecutor.executeHttpRequest(() -> productRenewService.addNewProductReminder(productReminderRecord),
				"/api/reminders/product", HttpMethod.POST);
	}

	@PatchMapping("{reminderId}/renew")
	public void renewProductForPeriodTime(@PathVariable BigDecimal reminderId,
										  @RequestBody ProductReminderRecord productReminderRecord) {
		httpRequestExecutor.executeHttpRequest(() -> productRenewService.renewProductForPeriodTime(reminderId,
						productReminderRecord),
				String.format("/api/product-renews/%s/renew", reminderId), HttpMethod.PATCH);
	}

	@DeleteMapping("{reminderId}")
	public void removeProductReminder(@PathVariable BigDecimal reminderId) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> productRenewService.removeProductReminder(reminderId),
					"/api/product-renews/" + reminderId, HttpMethod.DELETE);
		} catch (IndexOutOfBoundsException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "cannot find product reminder to delete with id " +
					"of" +
					" " + reminderId);
		}

	}

	@PatchMapping("{reminderId}")
	public void updateProductReminderData(@PathVariable BigDecimal reminderId,
										  @RequestBody ProductReminderRecord productReminderRecord) {
		httpRequestExecutor.executeHttpRequest(() -> productRenewService.updateProductReminderData(reminderId,
						productReminderRecord),
				"/api/product-renews/" + reminderId, HttpMethod.PATCH);
	}
}
