import { Button, Grid } from "@chakra-ui/react";
import { LegacyRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { DetailRow } from "../../../../components/DetailRow";
import ExtendFormRow from "../../../../components/ExtendFormRow";
import {
  calculateForwardDateByMonthsAndDays,
  getStringDate,
} from "../../../../services/utils";
import PeriodSelector from "../../../service-renews/PeriodSelector";
import { useAddServiceContract } from "../../../service-renews/hooks/useAddServiceContract";
import { useUpdateServiceContract } from "../../../service-renews/hooks/useUpdateServiceContract";
import {
  PeriodType,
  ServiceRenewRecord,
} from "../../../service-renews/serviceRenews";

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
  const { customerId } = useParams();
  const [period, setPeriod] = useState<PeriodType>(periodKind);
  const { addServiceContract } = useAddServiceContract();
  const { updateServiceContract } = useUpdateServiceContract();
  const { register, handleSubmit, formState, reset } =
    useForm<ServiceRenewRecord>();
  const { errors } = formState;
  const periodToMonths = {
    MONTHLY: 1,
    QUARTERLY: 3,
    YEARLY: 12,
  };
  function onSubmitForm(data: ServiceRenewRecord) {
    console.log("test", data);
    if (serviceRenewToEdit) {
      updateServiceContract({ ...data, contractID });
    } else {
      addServiceContract({ ...data, customerID: Number(customerId) });
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
          label='startDateOfContract'
          register={register}
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
          label='contractPrice'
          register={register}
          error={errors?.contractPrice}
          defaultValue={contractPrice}
          type='number'
          translationNS='serviceRenews'
          sx={{ gridArea: "price" }}
        />
        <ExtendFormRow
          label='contractDescription'
          register={register}
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
