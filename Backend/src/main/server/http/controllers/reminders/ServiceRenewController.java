package main.server.http.controllers.reminders;

import jakarta.persistence.EntityNotFoundException;
import main.server.http.HttpRequestExecutor;
import main.server.sql.dto.ListSubset;
import main.server.sql.dto.reminder.ContractRecord;
import main.server.sql.services.ContractService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static main.server.ServerConstants.SERVER_CROSS_ORIGIN;

@CrossOrigin(origins = SERVER_CROSS_ORIGIN)
@RestController
@RequestMapping("/api/contract-service")
public class ServiceRenewController {
	private final HttpRequestExecutor httpRequestExecutor;
	private final ContractService contractService;

	public ServiceRenewController(HttpRequestExecutor httpRequestExecutor,
								  ContractService contractService) {
		this.httpRequestExecutor = httpRequestExecutor;
		this.contractService = contractService;
	}

	@GetMapping("/reminders")
	public ListSubset<ContractRecord> getServiceRenewsReminders(@RequestParam int daysBeforeExpiration,
																@RequestParam int monthsAfterExpiration,
																@RequestParam(required = false) Integer pageNumber,
																@RequestParam(required = false) Integer pageSize) {
		return httpRequestExecutor.executeHttpRequest(() -> contractService.getServiceRenewRemindersInPeriodTime(monthsAfterExpiration, daysBeforeExpiration, pageNumber, pageSize), "/api/reminders" +
						"/renews",
				HttpMethod.GET);


	}


	@GetMapping("/customer/{customerId}")
	public ListSubset<ContractRecord> getContractServiceHistoryForCustomer(@PathVariable short customerId,
																		   @RequestParam(required = false) Integer pageNumber,
																		   @RequestParam(required = false) Integer pageSize) {
		try {
			return httpRequestExecutor.executeHttpRequest(() -> contractService.getServiceRenewRemindersForCustomer(customerId, pageNumber, pageSize), "/api/contract-service" +
							"/customer/" + customerId,
					HttpMethod.GET);
		} catch (EntityNotFoundException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}


	@PostMapping
	public Short addNewContract(@RequestBody ContractRecord contractRecord) {
		try {
			return httpRequestExecutor.executeHttpRequest(() -> contractService.addNewContract(contractRecord),
					"/api/contract-service/", HttpMethod.POST);
		} catch (IllegalStateException e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		} catch (IllegalArgumentException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}

	}

	@PatchMapping("{contractId}/renew")
	public void renewContractForPeriodTime(@PathVariable Long contractId, @RequestBody ContractRecord contractRecord) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> contractService.renewContractForPeriod(contractId,
							contractRecord),
					String.format("/api/contract-service/%d/renew/", contractId) + contractId, HttpMethod.PATCH);
		} catch (IndexOutOfBoundsException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"cannot find contract to renew with id of " + contractId);
		}
	}

	@DeleteMapping("{contractId}")
	public void removeContract(@PathVariable Long contractId) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> contractService.deleteContractByID(contractId),
					String.format("/api/contract-service/%d", contractId), HttpMethod.DELETE);
		} catch (IndexOutOfBoundsException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"cannot find contract to delete with id of " + contractId);
		}

	}

	@PatchMapping("{contractId}")
	public void updateContactData(@PathVariable Long contractId, @RequestBody ContractRecord contractRecord) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> contractService.updateContract(contractId, contractRecord),
					String.format("/api/contract-service/%d", contractId), HttpMethod.PATCH);
		} catch (IndexOutOfBoundsException e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"cannot find contract to update with id of " + contractRecord.contractID());
		}
	}


}
