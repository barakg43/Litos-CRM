import { ITEMS_AMOUNT_PER_PAGE } from "../components/Pagination";
import {
  CustomerFullDataType,
  CustomerSlimDetailsProps,
  CustomersListType,
} from "../features/customers/customers";
import { httpClient } from "./axios";
import { SubsetListType } from "./globalTypes";

export async function getCustomersSubset_API({
  page,
}: {
  page: number;
}): Promise<CustomersListType | undefined> {
  try {
    const { data }: { data: SubsetListType<CustomerSlimDetailsProps> } =
      await httpClient.get(`/customers`, {
        params: { pageNumber: page - 1, pageSize: ITEMS_AMOUNT_PER_PAGE },
      });
    return {
      customers: data.listSubset,
      totalItems: data.totalAmountInDataBase,
    };
  } catch (error: unknown) {
    console.log(error);
  }
}
export async function getCustomerDataByID_API(
  customerId: number
): Promise<CustomerFullDataType> {
  const { data }: { data: CustomerFullDataType } = await httpClient.get(
    `/customers/${customerId}`
  );
  return data;
}
export async function addNewCustomer_API({
  customerShortName,
  customerName,
  customerIdentificationNumber,
  customerStatus,
  remarks,
  customerMainPhone,
  customerMainEMail,
  contactPersonPost,
  contactPersonPhone,
  contactPersonName,
  contactPersonMobilePhone,
  city,
  address,
  addressRemarks,
}: CustomerFullDataType) {
  await httpClient.post("customers", {
    customerShortName,
    customerName,
    customerIdentificationNumber,
    customerStatus,
    remarks,
    customerMainPhone,
    customerMainEMail,
    contactPersonPost,
    contactPersonPhone,
    contactPersonName,
    contactPersonMobilePhone,
    city,
    address,
    addressRemarks,
  });
}
export async function updateCustomerDetails_API({
  customerID,
  customerShortName,
  customerName,
  customerIdentificationNumber,
  customerStatus,
  remarks,
  customerMainPhone,
  customerMainEMail,
  contactPersonPost,
  contactPersonPhone,
  contactPersonName,
  contactPersonMobilePhone,
  city,
  address,
  addressRemarks,
}: CustomerFullDataType) {
  await httpClient.patch(`customers/${customerID}`, {
    customerShortName,
    customerName,
    customerIdentificationNumber,
    customerStatus,
    remarks,
    customerMainPhone,
    customerMainEMail,
    contactPersonPost,
    contactPersonPhone,
    contactPersonName,
    contactPersonMobilePhone,
    city,
    address,
    addressRemarks,
  });
}

export async function deleteCustomer_API(customerID: number) {
  await httpClient.delete(`customers/${customerID}`);
}
