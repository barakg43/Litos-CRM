package main.server.sql.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import main.server.sql.dto.ListSubset;
import main.server.sql.dto.reminder.ContractRecord;
import main.server.sql.dto.reminder.ePeriodKind;
import main.server.sql.entities.CustomerEntity;
import main.server.sql.entities.ServiceContractEntity;
import main.server.sql.repositories.CustomerRepository;
import main.server.sql.repositories.ServiceContractRepository;
import main.server.uilities.UtilityFunctions;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static main.server.uilities.UtilityFunctions.getPageObject;

@Service
public class ContractService {
	private final ServiceContractRepository serviceContractRepository;
	private final CustomerRepository customerRepository;

	public ContractService(
			ServiceContractRepository serviceContractRepository,
			CustomerRepository customerRepository) {

		this.serviceContractRepository = serviceContractRepository;
		this.customerRepository = customerRepository;
	}


	public ListSubset<ContractRecord> getServiceRenewRemindersInPeriodTime(int monthsAfterExpiration,
																		   int daysBeforeExpiration,
																		   Integer pageNumber,
																		   Integer pageSize) {
		Pageable page = getPageObject(pageNumber, pageSize);
		Timestamp startDate = UtilityFunctions.postDateByMonthAmountFromToday(-monthsAfterExpiration);
		Timestamp finishDate = UtilityFunctions.postDateByDaysAmountFromToday(daysBeforeExpiration);
		List<ServiceContractEntity> serviceContractEntities =
				serviceContractRepository
						.findAllByRenewedIsFalseAndFinishDateOfContractBetweenOrderByFinishDateOfContractAsc(
								startDate,
								finishDate,
								page
						);
		long totalItemInPeriod = serviceContractRepository.countByRenewedFalseAndFinishDateOfContractBetween(startDate,
				finishDate);
		List<ContractRecord> subsetListRecords = serviceContractEntities.stream().map(ContractRecord::new).toList();

		return new ListSubset<>(subsetListRecords, totalItemInPeriod);
	}

	public ListSubset<ContractRecord> getServiceRenewRemindersForCustomer(short customerID, Integer pageNumber,
																		  Integer pageSize) {
		Pageable page = getPageObject(pageNumber, pageSize);

		Optional<CustomerEntity> customerToFind = customerRepository.findById(customerID);
		if (customerToFind.isEmpty())
			throw new EntityNotFoundException("cannot find customer with id of " + customerID);

		List<ServiceContractEntity> serviceContractListAllByCustomer =
				serviceContractRepository.findAllByCustomerOrderByStartDateOfContractDesc(customerToFind.get(), page);
		long totalItem = serviceContractRepository.countByCustomer(customerToFind.get());
		return new ListSubset<>(serviceContractListAllByCustomer.
				stream().map(ContractRecord::new).toList(), totalItem);
	}

	@Transactional
	public void updateContract(Long contractId, ContractRecord contractRecord) throws IndexOutOfBoundsException,
			IllegalArgumentException {
		ServiceContractEntity serviceContractEntity = serviceContractRepository
				.getContractByContractID(contractId);
		if (serviceContractEntity == null)
			throw new IndexOutOfBoundsException();
		serviceContractEntity.setContractPrice(contractRecord.contractPrice());
		serviceContractEntity.setContractDescription(contractRecord.contractDescription());
		serviceContractEntity.setPeriodKind(contractRecord.periodKind());
		serviceContractEntity.setStartDateOfContract(contractRecord.startDateOfContract());
		setContactFinishDateBaseOnStartDayForContract(contractRecord.periodKind(), serviceContractEntity,
				contractRecord.startDateOfContract());
		validAndSaveToRepository(serviceContractEntity);

	}

	public Short addNewContract(ContractRecord contractRecord) throws IllegalStateException, IllegalArgumentException {
		ServiceContractEntity serviceContractEntity = new ServiceContractEntity();
		if (customerRepository.existsById(contractRecord.customerID())) {
			CustomerEntity customerEntity = customerRepository.getReferenceById(contractRecord.customerID());

			if (customerEntity.getActiveContractID() != null) {
				throw new IllegalStateException("the customer already have active contact");
			}
			serviceContractEntity.setCustomerID(contractRecord.customerID());
			serviceContractEntity.setContractPrice(contractRecord.contractPrice());
			serviceContractEntity.setContractDescription(contractRecord.contractDescription());
			serviceContractEntity.setPeriodKind(contractRecord.periodKind());
			serviceContractEntity.setStartDateOfContract(contractRecord.startDateOfContract());
			setContactFinishDateBaseOnStartDayForContract(contractRecord.periodKind(), serviceContractEntity,
					contractRecord.startDateOfContract());
			CustomerEntity savedUpdatedCustomer = saveContractAndUpdateActiveContractInCustomer(serviceContractEntity);
			return savedUpdatedCustomer.getCustomerID();
		} else {
			throw new IllegalArgumentException("customer with this id not exist");
		}


	}

	@Transactional
	public void deleteContractByID(Long contractID) throws IndexOutOfBoundsException {

		if (serviceContractRepository.existsById(contractID))
			serviceContractRepository.deleteById(contractID);
		else
			throw new IndexOutOfBoundsException();

	}

	@Transactional
	public void setContactReminderState(Long contactID, boolean toEnable) throws IndexOutOfBoundsException {
		ServiceContractEntity serviceContractEntity = serviceContractRepository
				.getContractByContractID(contactID);
		if (serviceContractEntity == null)
			throw new IndexOutOfBoundsException();
		if (toEnable) {
			setContactFinishDateBaseOnStartDayForContract(serviceContractEntity.getPeriodKind(), serviceContractEntity,
					serviceContractEntity.getStartDateOfContract());
		} else {
			serviceContractEntity.setFinishDateOfContract(null);
		}

	}

	@Transactional
	public void renewContractForPeriod(Long contractId, ContractRecord contractRecord) throws IndexOutOfBoundsException, IllegalArgumentException {
		//close the current contract
		ServiceContractEntity currentContract =
				serviceContractRepository.getContractByContractID(contractId);
		if (currentContract == null)
			throw new IndexOutOfBoundsException();
		currentContract.setRenewed(true);
//		currentContract.setContractPrice(contractRecord.contractPrice());
//		currentContract.setContractDescription(contractRecord.contractDescription());
		//create new contract
		ServiceContractEntity newContract = new ServiceContractEntity();
		newContract.setCustomerID(currentContract.getCustomerID());
		Timestamp startDateForNewContract =
				UtilityFunctions.postDateByDaysAmount(currentContract.getFinishDateOfContract(), 1);
		newContract.setStartDateOfContract(startDateForNewContract);
		setContactFinishDateBaseOnStartDayForContract(contractRecord.periodKind(), newContract,
				startDateForNewContract);
		newContract.setContractPrice(contractRecord.contractPrice());
		newContract.setContractDescription(contractRecord.contractDescription());
		newContract.setPeriodKind(contractRecord.periodKind());
		UtilityFunctions.validEntityValidations(currentContract);
		validAndSaveToRepository(currentContract);
		saveContractAndUpdateActiveContractInCustomer(newContract);
	}

	private CustomerEntity saveContractAndUpdateActiveContractInCustomer(ServiceContractEntity newContract) {
		UtilityFunctions.validEntityValidations(newContract);
		ServiceContractEntity savedContract = validAndSaveToRepository(newContract);
		CustomerEntity customerToUpdate = customerRepository.getReferenceById(savedContract.getCustomerID());
		customerToUpdate.setActiveContractID(savedContract.getContractID());
		return customerRepository.save(customerToUpdate);
	}

	private void setContactFinishDateBaseOnStartDayForContract(ePeriodKind periodKind,
															   ServiceContractEntity newContract,
															   Timestamp startDateForNewContract) {
		int periodInMonths = periodKind.getMonthsPeriod();
		newContract.setFinishDateOfContract(UtilityFunctions.postDateByMonthAmount(startDateForNewContract,
				periodInMonths));
	}

	private ServiceContractEntity validAndSaveToRepository(ServiceContractEntity serviceContractEntity) {
		UtilityFunctions.validEntityValidations(serviceContractEntity);
		return serviceContractRepository.save(serviceContractEntity);
	}
}
