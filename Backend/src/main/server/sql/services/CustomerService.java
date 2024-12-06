package main.server.sql.services;

import jakarta.transaction.Transactional;
import main.server.sql.dto.ListSubset;
import main.server.sql.dto.customer.CustomerFullDetailsRecord;
import main.server.sql.dto.customer.CustomerSlimDetailsRecord;
import main.server.sql.entities.CustomerEntity;
import main.server.sql.repositories.CustomerRepository;
import main.server.uilities.UtilityFunctions;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
	private final CustomerRepository customerRepository;

	public CustomerService(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	public ListSubset<CustomerSlimDetailsRecord> getSubsetOfCustomers(Integer pageNumber, Integer pageSize,
																	  String query) {

		Page<CustomerEntity> customerListEntities;
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnorePaths("customerID")
				.withMatcher("customerName", ExampleMatcher.GenericPropertyMatchers.contains())
				.withMatcher("customerShortName", ExampleMatcher.GenericPropertyMatchers.contains())
				.withIgnoreCase()
				.withIgnoreNullValues();
		CustomerEntity customerToFilter = new CustomerEntity();
		customerToFilter.setCustomerName(query);
		customerToFilter.setCustomerShortName(query);
		Example<CustomerEntity> exampleCustomer = Example.of(customerToFilter, matcher);

		if (pageSize != null && pageNumber != null) {
			customerListEntities = customerRepository.findAll(exampleCustomer, PageRequest.of(pageNumber - 1,
					pageSize));
		} else //get all entities
			customerListEntities = customerRepository.findAll(exampleCustomer, Pageable.unpaged());
		List<CustomerSlimDetailsRecord> customerList =
				customerListEntities.stream().map(CustomerSlimDetailsRecord::new).toList();
		long totalItemInDb = getCustomersAmount(exampleCustomer);
		return new ListSubset<>(customerList, totalItemInDb);

	}

	public Short addNewCustomer(CustomerFullDetailsRecord customerDetails) throws IllegalArgumentException {
		CustomerEntity customer = new CustomerEntity(customerDetails);
		CustomerEntity customerSaved = validAndSaveToRepository(customer);
		return customerSaved.getCustomerID();
	}

	@Transactional
	public void updateCustomerDetails(Short customerId, CustomerFullDetailsRecord customerDetailsUpdated) throws IndexOutOfBoundsException {

		Optional<CustomerEntity> customerToUpdatedOptional = customerRepository.findById(customerId);
		if (customerToUpdatedOptional.isEmpty())
			throw new IndexOutOfBoundsException("CustomerEntity with id " + customerId + " " +
					"not " +
					"exist!");


		CustomerEntity customerToUpdated = customerToUpdatedOptional.get();
		customerToUpdated.copyFieldsFromCustomerRecord(customerDetailsUpdated);
		validAndSaveToRepository(customerToUpdated);
	}

	private CustomerEntity validAndSaveToRepository(CustomerEntity customerEntityToSave) {
		UtilityFunctions.validEntityValidations(customerEntityToSave);
		return customerRepository.save(customerEntityToSave);
	}

	public CustomerFullDetailsRecord getFullCustomerDetailsForId(int id) {
		return customerRepository.getCustomerByCustomerID(id);
	}

	@Transactional
	public void deleteCustomer(short id) throws IndexOutOfBoundsException {
		if (customerRepository.existsById(id))
			customerRepository.deleteById(id);
		else
			throw new IndexOutOfBoundsException();

	}

	private long getCustomersAmount(Example<CustomerEntity> example) {
		return customerRepository.count(example);
	}
}
