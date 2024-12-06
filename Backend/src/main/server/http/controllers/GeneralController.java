package main.server.http.controllers;

import main.server.http.HttpRequestExecutor;
import main.server.sql.dto.reminder.RemindersAmount;
import main.server.sql.services.GeneralService;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.*;

import static main.server.ServerConstants.SERVER_CROSS_ORIGIN;

@CrossOrigin(origins = SERVER_CROSS_ORIGIN)
@RestController
@RequestMapping("/api/app")
public class GeneralController {
	private final GeneralService generalService;
	private final HttpRequestExecutor httpRequestExecutor;


	public GeneralController(GeneralService generalService, HttpRequestExecutor httpRequestExecutor) {
		this.generalService = generalService;
		this.httpRequestExecutor = httpRequestExecutor;
	}

	@GetMapping("/reminders")
	public RemindersAmount getRemindersAmounts(@RequestParam int daysBeforeExpirationService,
											   @RequestParam int daysBeforeExpirationProduct,
											   @RequestParam int monthsAfterExpiration) {
		return httpRequestExecutor.executeHttpRequest(() ->
						generalService.getReminderAmount(daysBeforeExpirationService, daysBeforeExpirationProduct,
								monthsAfterExpiration),
				"/api/app/reminders", HttpMethod.GET);
	}
}
