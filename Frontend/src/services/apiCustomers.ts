import { ITEMS_AMOUNT_PER_PAGE } from "../components/Pagination";
import {
  CustomersListType,
  CustomerSlimDetailsProps,
} from "../features/customers/customers";
import { httpClient } from "./axios";
import { SubsetListType } from "./globalTypes";

type allCustomerParams = {
  page: number;
};

export async function getAllCustomers({
  page,
}: allCustomerParams): Promise<CustomersListType> {
  const fromItem = (page - 1) * ITEMS_AMOUNT_PER_PAGE;
  const toItem = fromItem + ITEMS_AMOUNT_PER_PAGE;
  const { data }: { data: SubsetListType<CustomerSlimDetailsProps> } =
    await httpClient.get(`/customers?fromItem=${fromItem}&toItem=${toItem}`);
  return { customers: data.listSubset, totalItems: data.totalAmountInDataBase };
}
export async function getCustomerDataByID(
  customerId: number
): Promise<CustomerSlimDetailsProps> {
  const { data }: { data: CustomerSlimDetailsProps } = await httpClient.get(
    `/customers/${customerId}`
  );
  return data;
}
