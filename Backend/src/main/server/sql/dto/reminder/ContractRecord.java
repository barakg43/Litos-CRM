package main.server.sql.dto.reminder;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import main.server.sql.entities.ServiceContractEntity;

import java.math.BigDecimal;
import java.sql.Timestamp;


public record ContractRecord(@NotNull Long contractID, @NotNull Short customerID, String customerShortName,
							 @NotNull Timestamp startDateOfContract,
							 @NotNull Timestamp finishDateOfContract, @Nullable BigDecimal contractPrice,
							 @NotNull ePeriodKind periodKind,
							 @Nullable String contractDescription) {

	public ContractRecord(ServiceContractEntity serviceContractEntity) {
		this(serviceContractEntity.getContractID(), serviceContractEntity.getCustomerID(),
				serviceContractEntity.getCustomer().getCustomerShortName(),
				serviceContractEntity.getStartDateOfContract(),
				serviceContractEntity.getFinishDateOfContract(),
				serviceContractEntity.getContractPrice(),
				serviceContractEntity.getPeriodKind(),
				serviceContractEntity.getContractDescription());
	}

}