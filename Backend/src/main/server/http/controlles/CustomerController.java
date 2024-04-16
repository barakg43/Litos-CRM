package main.server.http.controlles;

import main.server.http.HttpRequestExecutor;
import main.server.sql.dto.ListSubset;
import main.server.sql.dto.TaskRecord;
import main.server.sql.dto.customer.CustomerFullDetailsRecord;
import main.server.sql.dto.customer.CustomerSlimDetailsRecord;
import main.server.sql.services.CustomerService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

import static main.server.ServerConstants.SERVER_CROSS_ORIGIN;

@CrossOrigin(origins = SERVER_CROSS_ORIGIN)
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final HttpRequestExecutor httpRequestExecutor;
	final private CustomerService customerService;

	public CustomerController(HttpRequestExecutor httpRequestExecutor, CustomerService customerService) {
		this.httpRequestExecutor = httpRequestExecutor;
//        sqlClient = new SqlClient(SQL_YAML_CONFIG_LOCATION, logManager);
		this.customerService = customerService;
	}

	//    @PostConstruct //start sql connection after CustomerHttpService ctor
	private void startSqlConnection() {
//        sqlClient.createSqlConnection();
	}


	@GetMapping("")
	public ListSubset<CustomerSlimDetailsRecord> getSubsetCustomersList(@RequestParam(required = false) Integer pageNumber,
																		@RequestParam(required = false) Integer pageSize) {

		ListSubset<CustomerSlimDetailsRecord> test =
				httpRequestExecutor.executeHttpRequest(() -> customerService.getSubsetOfCustomers(pageNumber, pageSize)
						, "api/customers",
						HttpMethod.GET);
		System.out.println(test.getListSubset());
		return test;

	}


	@GetMapping("/customer/name")
	public String getCostumerNameByID(@RequestParam int id) {
		return httpRequestExecutor.executeHttpRequest(() -> customerService.getCustomerNameByID(id), "api" +
				"/customers" +
				"/name", HttpMethod.GET);
//        return clientSqlExecutor.getClientNameByID(id);
	}

	@GetMapping("/{id}")
	public CustomerFullDetailsRecord getFullCustomerDetailsForId(@PathVariable("id") int id) {
		try {
			CustomerFullDetailsRecord test =
					httpRequestExecutor.executeHttpRequest(() -> customerService.getFullCustomerDetailsForId(id),
							"api/customers/" + id
							, HttpMethod.GET);
			System.out.println("getFullCustomerDetailsForId" + test);
			return test;
		} catch (IndexOutOfBoundsException exception) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cant find customer with id of " + id, exception);
		}
	}

	@PostMapping("")
	public void addNewCustomer(@RequestBody CustomerFullDetailsRecord customerDetails) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> customerService.addNewCustomer(customerDetails),
					"api/customers/"
					, HttpMethod.POST);
		} catch (IllegalArgumentException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
		}
	}

	@PatchMapping("/{customerId}")
	public void updateCustomerDetails(@PathVariable("customerId") short customerId,
									  @RequestBody CustomerFullDetailsRecord customerDetails) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> customerService.updateCustomerDetails(customerId,
							customerDetails),
					"api/customers/" + customerId
					, HttpMethod.PATCH);

		} catch (IndexOutOfBoundsException exception) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cant update customer with id of " + customerId, exception);
		}
	}

	@DeleteMapping("/{id}")
	public void deleteCustomer(@PathVariable("id") short id) {
		try {
			httpRequestExecutor.executeHttpRequest(() -> customerService.deleteCustomer(id),
					"api/customers/" + id
					, HttpMethod.DELETE);

		} catch (IndexOutOfBoundsException exception) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cant delete customer with id of " + id, exception);
		}
	}


	@GetMapping("/customer/closed-tasks")
	public List<TaskRecord> getClosedTaskForCustomer(@RequestParam int id) {
//        return sqlClient.getClosedTaskForCustomer(id);
		return null;
	}

	@GetMapping("/supplier/name")
	public String getSupplierNameByID(@RequestParam int id) {
		String result = "";
		Instant startTime = Instant.now();
//        result = sqlClient.getSupplierNameByID(id);
		Instant endTime = Instant.now();
		return result;
	}
}
