import {
  RenewServiceContract,
  ServiceRenewRecord,
} from "../../../features/service-renews/serviceRenews";
import { httpClient } from "../../axios";
import { ITEMS_AMOUNT_PER_PAGE, SubsetListType } from "../../globalTypes";
import { translateToast } from "../../utils";
import { baseApi } from "../baseApi";

export async function addNewServicesRenew_API({
  customerID,
  startDateOfContract,
  contractPrice,
  periodKind,
  contractDescription,
}: ServiceRenewRecord) {
  try {
    await httpClient.post("/contract-service", {
      customerID,
      startDateOfContract,
      contractPrice,
      periodKind,
      contractDescription,
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}

export async function updateServiceRenewDetails_API({
  contractID,
  startDateOfContract,
  contractPrice,
  periodKind,
  contractDescription,
}: ServiceRenewRecord) {
  try {
    httpClient.patch(`/contract-service/${contractID}`, {
      startDateOfContract,
      contractPrice,
      periodKind,
      contractDescription,
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}

export async function getServiceRenewById(contractID: number) {
  console.log(contractID);
}

export async function renewService_API({
  contractID,
  contractPrice,
  periodKind,
  contractDescription,
}: RenewServiceContract) {
  try {
    httpClient.patch(`/contract-service/${contractID}/renew`, {
      contractPrice,
      periodKind,
      contractDescription,
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}
export async function getAllServiceRenewForPeriodTime_API({
  daysBeforeExpiration,
  monthsAfterExpiration,
  page,
}: {
  daysBeforeExpiration: number;
  monthsAfterExpiration: number;
  page: number;
}): Promise<SubsetListType<ServiceRenewRecord> | never | undefined> {
  try {
    return await httpClient.get("/contract-service/reminders", {
      params: {
        daysBeforeExpiration,
        monthsAfterExpiration,
        pageNumber: page,
        pageSize: ITEMS_AMOUNT_PER_PAGE,
      },
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}
export async function getAllServiceContractHistoryCustomer({
  customerId,
  page,
  itemsPerPage,
}: {
  customerId: number;
  page: number;
  itemsPerPage: number;
}): Promise<SubsetListType<ServiceRenewRecord> | never | undefined> {
  try {
    return await httpClient.get(`/contract-service/customer/${customerId}`, {
      params: {
        pageNumber: page,
        pageSize: itemsPerPage,
      },
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}
export async function deleteServiceRenew_API(contractID: number) {
  try {
    httpClient.delete(`/contract-service/${contractID}`);
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}
const serviceRenewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addServicesRenew: build.mutation<void, ServiceRenewRecord>({
      query: (data) => ({
        url: "/contract-service",
        method: "POST",
        body: data,
      }),
      invalidatesKeys: () => ["contract-service"],
      onSuccess: () => {
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "add",
        });
      },
      onError: () => {
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "add",
        });
      },
    }),
    updateServiceRenew: build.mutation<void, ServiceRenewRecord>({
      query: ({ contractID, ...data }) => ({
        url: `/contract-service/${contractID}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesKeys: () => ["contract-service"],
      onSuccess: () => {
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "update",
        });
      },
      onError: () => {
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "update",
        });
      },
    }),
    renewServiceReminder: build.mutation<void, RenewServiceContract>({
      query: ({ contractID, ...data }) => ({
        url: `/contract-service/${contractID}/renew`,
        method: "PATCH",
        body: data,
      }),
      invalidatesKeys: () => ["contract-service"],
      onSuccess: () => {
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "renew",
        });
      },
      onError: () => {
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "renew",
        });
      },
    }),
    serviceRenewForPeriodTime: build.query({
      query: ({
        daysBeforeExpiration,
        monthsAfterExpiration,
        page,
      }: {
        daysBeforeExpiration: number;
        monthsAfterExpiration: number;
        page: number;
      }) => ({
        url: "/contract-service/reminders",
        params: {
          daysBeforeExpiration,
          monthsAfterExpiration,
          pageNumber: page,
          pageSize: ITEMS_AMOUNT_PER_PAGE,
        },
      }),
      transformResponse: (data: SubsetListType<ServiceRenewRecord>) => ({
        serviceContractRenews: data.listSubset,
        totalItems: data.totalAmountInDataBase,
      }),
      providesQueryKeys: () => ["contract-service"],
    }),
    serviceContractHistoryCustomer: build.query({
      query: ({
        customerId,
        page,
        itemsPerPage,
      }: {
        customerId: number;
        page: number;
        itemsPerPage: number;
      }) => ({
        url: `/contract-service/customer/${customerId}`,
        params: {
          pageNumber: page,
          pageSize: itemsPerPage,
        },
      }),
      transformResponse: (data: SubsetListType<ServiceRenewRecord>) => ({
        serviceContractRenews: data.listSubset,
        totalItems: data.totalAmountInDataBase,
      }),

      providesQueryKeys: () => ["contract-service"],
    }),
    deleteServiceContract: build.mutation<void, number>({
      query: (contractID) => ({
        url: `/contract-service/${contractID}`,
        method: "DELETE",
      }),
      invalidatesKeys: () => ["contract-service"],
      onSuccess: () => {
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "delete",
        });
      },
      onError: () => {
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "serviceRenews",
          keyPrefix: "delete",
        });
      },
    }),
  }),
});
export const {
  useAddServicesRenewMutation,
  useUpdateServiceRenewMutation,
  useDeleteServiceContractMutation,
  useRenewServiceReminderMutation,
  useServiceRenewForPeriodTimeQuery,
  useServiceContractHistoryCustomerQuery,
} = serviceRenewApi;
