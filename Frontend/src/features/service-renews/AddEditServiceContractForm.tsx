import { LegacyRef } from "react";
import { ServiceRenewRecord } from "./serviceRenews";
import { useTranslation } from "react-i18next";
import { useAddServiceContract } from "./hooks/useAddServiceContract";
import { useUpdateServiceContract } from "./hooks/useUpdateServiceContract";

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
    contactDescription,
    contractID,
    contractPrice,
    finishDateOfContract,
    periodKind,
    startDateOfContract,
  } = serviceRenewToEdit;
  const { t } = useTranslation("serviceRenews", { keyPrefix: "renew-table" });
  const { addServiceContract } = useAddServiceContract();
  const { updateServiceContract } = useUpdateServiceContract();

  function handleSubmit(data: ServiceRenewRecord) {
    if (serviceRenewToEdit) {
      updateServiceContract(data);
    } else {
      addServiceContract(data);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HStack gap={"1rem"} justifyContent='space-around'>
        <VStack justifyItems='flex-start'>
          <FormRowCustomer
            register={register}
            label='customerName'
            defaultValue={customerName}
            maxLength={100}
            error={errors?.customerName}
          />
          <FormRowCustomer
            register={register}
            label='customerShortName'
            defaultValue={customerShortName}
            isRequired
            maxLength={50}
            error={errors?.customerShortName}
          />

          <FormRowCustomer
            register={register}
            label='customerIdentificationNumber'
            defaultValue={customerIdentificationNumber}
            maxLength={9}
            error={errors?.customerIdentificationNumber}
          />

          <StatusSelect
            value={customerStatus}
            register={register("customerStatus")}
          />
          <FormRowCustomer
            register={register}
            label='customerMainPhone'
            defaultValue={customerMainPhone}
            isRequired
            maxLength={10}
            error={errors?.customerMainPhone}
          />

          <FormRowCustomer
            register={register}
            label='customerMainEMail'
            defaultValue={customerMainEMail}
            maxLength={100}
            error={errors?.customerMainEMail}
          />

          <FormRowCustomer
            register={register}
            label='remarks'
            defaultValue={remarks}
            type='textarea'
          />
        </VStack>
        <VStack>
          <FormRowCustomer
            label='contactPersonName'
            defaultValue={contactPersonName}
            maxLength={30}
            register={register}
            error={errors?.contactPersonName}
          />

          <FormRowCustomer
            label='contactPersonPost'
            defaultValue={contactPersonPost}
            maxLength={50}
            register={register}
            error={errors?.contactPersonPost}
          />

          <FormRowCustomer
            label='contactPersonMobilePhone'
            defaultValue={contactPersonMobilePhone}
            register={register}
            maxLength={11}
            error={errors?.contactPersonMobilePhone}
          />

          <FormRowCustomer
            label='contactPersonPhone'
            defaultValue={contactPersonPhone}
            register={register}
            maxLength={10}
            error={errors?.contactPersonPhone}
          />

          <FormRowCustomer
            label='address'
            defaultValue={address}
            register={register}
            maxLength={80}
            error={errors?.address}
          />

          <FormRowCustomer
            label='city'
            defaultValue={city}
            register={register}
            maxLength={50}
            error={errors?.city}
          />

          <FormRowCustomer
            label='postalCode'
            defaultValue={postalCode}
            register={register}
            maxLength={7}
            error={errors?.postalCode}
          />

          <FormRowCustomer
            label='addressRemarks'
            defaultValue={addressRemarks}
            register={register}
            type='textarea'
          />
        </VStack>
      </HStack>
      <Button ref={submitRef} display='none' type='submit' />
    </form>
    // <Stack divider={<StackDivider />} spacing='3'>
    //   <HStack divider={<StackDivider />}>
    //     <DetailRow
    //       label={t("startDateOfContract")}
    //       value={new Date(startDateOfContract).toLocaleDateString()}
    //     />
    //     <DetailRow
    //       label={t("finishDateOfContract")}
    //       value={new Date(finishDateOfContract).toLocaleDateString()}
    //     />

    //     <DetailRow label={t("periodKind")} value={t("period." + periodKind)} />
    //   </HStack>
    //   <HStack divider={<StackDivider />}>
    //     <DetailRow label={t("contractPrice")} value={contractPrice} />
    //     <DetailRow label={t("contactDescription")} value={contactDescription} />
    //   </HStack>
    //   <RenewServicePanel
    //     contractID={contractID}
    //     submitButtonRef={submitButtonRef}
    //     onSubmit={onSubmit}
    //     contractPrice={contractPrice}
    //     defaultPeriodKind={periodKind}
    //   />
    // </Stack>
  );
}

export default AddEditServiceContractForm;
