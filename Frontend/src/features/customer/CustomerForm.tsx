import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { LegacyRef } from "react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import StyledSelect, { Option } from "../../components/StyledSelect.tsx";
import {
  useAddNewCustomerMutation,
  useUpdateCustomerMutation,
} from "../../services/redux/api/apiCustomers.ts";
import { customerStatuses } from "../customers/CustomersTable.tsx";
import { CustomerFullDataType } from "../customers/customers";
import FormRowCustomer from "./FormRowCustomer.tsx";
import { useCustomerIdParam } from "./hooks/useCustomerIdParam.ts";

function CustomerForm({
  submitRef,
  customerToEdit = {},
  OnSubmit,
}: {
  submitRef: LegacyRef<HTMLButtonElement> | undefined;
  customerToEdit?: CustomerFullDataType | Record<string, never>;
  OnSubmit?: () => void;
}) {
  const { register, handleSubmit, formState, reset } =
    useForm<CustomerFullDataType>(); // reset, getValues
  const { errors } = formState;
  const customerID = useCustomerIdParam();
  const [updateCustomerDetails, isUpdating] = useUpdateCustomerMutation();
  const [addNewCustomer, isAdding] = useAddNewCustomerMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const isSubmiting = isAdding || isUpdating;
  console.log("isSubmiting", isSubmiting);

  const {
    customerName,
    customerShortName,
    customerStatus,
    customerIdentificationNumber,
    customerMainPhone,
    customerMainEMail,
    remarks,
    address,
    city,
    postalCode,
    addressRemarks,
    contactPersonName,
    contactPersonPhone,
    contactPersonPost,
    contactPersonMobilePhone,
  } = customerToEdit;

  function onSubmit(data: CustomerFullDataType) {
    if (errors && Object.keys(errors).length > 0) return;

    if (customerID) {
      updateCustomerDetails({ ...data, customerID });
    } else {
      addNewCustomer(data);
    }
    reset();
    OnSubmit?.();
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
  );
}
function StatusSelect({
  register,
  value,
}: {
  register?: UseFormRegisterReturn<string> | undefined;
  value?: string | number | readonly string[] | undefined;
}) {
  const { t } = useTranslation("customers");
  const StatusOptions: Option[] = customerStatuses.map((customerStatus) => {
    return {
      label: t("status." + customerStatus),
      value: customerStatus,
    };
  });

  return (
    <FormControl isRequired display='flex' alignItems='center'>
      <FormLabel width='12rem'>{t("details.customerStatus")}</FormLabel>
      <StyledSelect
        width='10rem'
        value={value}
        options={StatusOptions}
        register={register}
      ></StyledSelect>
    </FormControl>
  );
}
export default CustomerForm;
