import { GenericAbortSignal } from "axios";
import {
  CustomerFullDataType,
  CustomerSlimDetailsProps,
  CustomersListType,
} from "../../../features/customers/customers";
import { httpClient } from "../../axios";
import { ITEMS_AMOUNT_PER_PAGE, SubsetListType } from "../../globalTypes";
import { translateToast } from "../../utils";
import { baseApi } from "../baseApi";

export async function getCustomersSubset_API({
  page,
  querySearch,
  signal,
}: {
  page: number;
  querySearch?: string | undefined;
  signal?: GenericAbortSignal | undefined;
}): Promise<CustomersListType | undefined> {
  try {
    const data: SubsetListType<CustomerSlimDetailsProps> = await httpClient.get(
      `/customers`,
      {
        params: {
          pageNumber: page,
          pageSize: ITEMS_AMOUNT_PER_PAGE,
          query: querySearch,
        },
        signal,
      }
    );
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
  return await httpClient.get(`/customers/${customerId}`);
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
  postalCode,
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
    postalCode,
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
  postalCode,
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
    postalCode,
    addressRemarks,
  });
}

export async function deleteCustomer_API(customerID: number) {
  await httpClient.delete(`customers/${customerID}`);
}

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    customersList: builder.query({
      query: ({
        page,
        querySearch,
      }: {
        page: number;
        querySearch?: string | undefined;
      }) => ({
        url: "/customers",
        params: {
          pageNumber: page,
          pageSize: ITEMS_AMOUNT_PER_PAGE,
          query: querySearch,
        },
      }),
      autoCancellation: true,

      providesQueryKeys: ({ page, querySearch }) => [
        "customers",
        page,
        querySearch,
      ],

      transformResponse: (data: SubsetListType<CustomerSlimDetailsProps>) => ({
        customers: data.listSubset,
        totalItems: data.totalAmountInDataBase,
      }),
    }),
    customerDetails: builder.query<CustomerFullDataType>({
      query: (customerID: number) => `/customers/${customerID}`,
      providesQueryKeys: (customerID) => ["customer", customerID],
    }),
    addNewCustomer: builder.mutation<void, CustomerFullDataType>({
      query: (customerData) => ({
        url: "/customers",
        method: "POST",
        body: customerData,
      }),
      onSuccess: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "add",
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
        });
      },
      onError: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "add",
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
        });
      },
      invalidatesKeys: () => ["customers"],
    }),
    deleteCustomer: builder.mutation<void, number>({
      query: (customerId: number) => ({
        url: `/customers/${customerId}`,
        method: "DELETE",
      }),
      onSuccess: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "delete",
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
        });
      },
      onError: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "delete",
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
        });
      },
      invalidatesKeys: () => ["customers"],
    }),
    updateCustomer: builder.mutation({
      query: ({ customerID, ...customerData }: CustomerFullDataType) => ({
        url: `/customers/${customerID}`,
        method: "PATCH",
        body: customerData,
      }),

      onSuccess: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "update",
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
        });
      },
      onError: () => {
        translateToast({
          translationNS: "customers",
          keyPrefix: "update",
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
        });
      },
      invalidatesKeys: ({ customerID }) => ["customer", customerID],
    }),
  }),
  overrideExisting: "throw",
});
export const {
  useCustomersListQuery,
  useCustomerDetailsQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useAddNewCustomerMutation,
} = customerApi;
