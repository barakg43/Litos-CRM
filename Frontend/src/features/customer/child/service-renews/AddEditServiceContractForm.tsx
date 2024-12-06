import { Button, Grid } from "@chakra-ui/react";
import { LegacyRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DetailRow } from "../../../../components/DetailRow";
import ExtendFormRow from "../../../../components/ExtendFormRow";
import {
  useAddServicesRenewMutation,
  useUpdateServiceRenewMutation,
} from "../../../../services/redux/api/apiServiceRenew";
import {
  calculateForwardDateByMonthsAndDays,
  getStringDate,
} from "../../../../services/utils";
import PeriodSelector from "../../../service-renews/PeriodSelector";
import {
  PeriodType,
  ServiceRenewRecord,
} from "../../../service-renews/serviceRenews";
import { useCustomerIdParam } from "../../hooks/useCustomerIdParam";

function AddEditServiceContractForm({
  submitButtonRef,
  serviceRenewToEdit = {},
  onSubmit,
}: {
  submitButtonRef: LegacyRef<HTMLButtonElement> | undefined;
  serviceRenewToEdit?: ServiceRenewRecord | Record<string, never>;
  onSubmit?: () => void;
}) {
  const {
    contractDescription,
    contractID,
    contractPrice,
    periodKind,
    startDateOfContract,
  } = serviceRenewToEdit;
  console.log("ser", serviceRenewToEdit);

  const customerID = useCustomerIdParam();
  const [period, setPeriod] = useState<PeriodType>(periodKind);
  const [addServiceContract] = useAddServicesRenewMutation();
  const [updateServiceContract] = useUpdateServiceRenewMutation();
  const { register, handleSubmit, formState, reset } =
    useForm<ServiceRenewRecord>();
  const { errors } = formState;
  const periodToMonths = {
    MONTHLY: 1,
    QUARTERLY: 3,
    YEARLY: 12,
  };
  function onSubmitForm(data: ServiceRenewRecord) {
    if (contractID) {
      updateServiceContract({ ...data, contractID });
    } else {
      addServiceContract({ ...data, customerID });
    }
    onSubmit?.();
    reset();
  }
  const startDate = startDateOfContract
    ? new Date(startDateOfContract)
    : new Date();
  const finishDateDefaultValue = getStringDate(
    calculateForwardDateByMonthsAndDays({
      startDate: startDate,
      months: periodToMonths[period],
    })
  );

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Grid
        gridTemplateAreas={`"start finish"
                            "period period"
                            "price contact"
                            "child description"`}
      >
        <ExtendFormRow
          fieldName='startDateOfContract'
          registerFn={register}
          defaultValue={startDate.toLocaleDateString("en-CA")}
          error={errors?.startDateOfContract}
          type='date'
          translationNS='serviceRenews'
          sx={{ gridArea: "start" }}
        />

        <PeriodSelector
          defaultValue={period}
          onChange={setPeriod}
          register={register("periodKind", { required: true })}
          sx={{ gridArea: "period" }}
        />
        <DetailRow
          label='finishDateOfContract'
          value={finishDateDefaultValue}
          sx={{ gridArea: "finish" }}
        />
        <ExtendFormRow
          fieldName='contractPrice'
          registerFn={register}
          error={errors?.contractPrice}
          defaultValue={contractPrice}
          type='number'
          translationNS='serviceRenews'
          sx={{ gridArea: "price" }}
        />
        <ExtendFormRow
          fieldName='contractDescription'
          registerFn={register}
          error={errors?.contractDescription}
          defaultValue={contractDescription}
          type='textarea'
          translationNS='serviceRenews'
          sx={{ gridArea: "description" }}
        />
      </Grid>
      <Button ref={submitButtonRef} display='none' type='submit' />
    </form>
  );
}

export default AddEditServiceContractForm;
