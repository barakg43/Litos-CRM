import { ServiceRenewRecord } from "../../../features/service-renews/serviceRenews";
import { httpClient } from "../../axios";
import {
  ITEMS_AMOUNT_PER_PAGE,
  ITEMS_AMOUNT_PER_TAB,
  SubsetListType,
} from "../../globalTypes";
import { translateToast } from "../../utils";
import { baseApi } from "../baseApi";

export async function addNewProductReminder_API(
  data: ProductReminderRecord
): Promise<number | undefined> {
  try {
    return await httpClient.post("/product-renews", data);
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}

export async function updateProductReminder_API({
  systemDetailID,
  productDetailDescription,
  notes1,
  notes2,
  notes3,
  notes4,
  price,
  validityTill,
}: RenewProductRecord) {
  try {
    httpClient.patch(`/product-renews/${systemDetailID}`, {
      productDetailDescription,
      notes1,
      notes2,
      notes3,
      notes4,
      price,
      validityTill,
    });
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}

export async function getProductRemindersByCustomerId_API({
  customerID,
  page,
}: {
  customerID: number;
  page: number;
}): Promise<SubsetListType<ServiceRenewRecord> | never | undefined> {
  return await httpClient.get(`/product-renews/customer/${customerID}`, {
    params: {
      pageNumber: page,
      pageSize: ITEMS_AMOUNT_PER_TAB,
    },
  });
}
export async function renewProductReminder_API({
  systemDetailID,
  validityTill,
  productDetailDescription,
  notes1,
  notes2,
  notes3,
  notes4,
  price,
}: RenewProductRecord) {
  await httpClient.patch(`/product-renews/${systemDetailID}/renew`, {
    validityTill,
    productDetailDescription,
    notes1,
    notes2,
    notes3,
    notes4,
    price,
  });
}
export async function getAllProductReminderForPeriodTime_API({
  daysBeforeExpiration,
  monthsAfterExpiration,
  page,
}: {
  daysBeforeExpiration: number;
  monthsAfterExpiration: number;
  page: number;
}): Promise<SubsetListType<ServiceRenewRecord> | never | undefined> {
  try {
    return await httpClient.get(`/product-renews/reminders`, {
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
export async function deleteProductReminder_API(reminderId: number) {
  try {
    await httpClient.delete(`/product-renews/${reminderId}`);
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
}
// function timeout(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

const productRenewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addNewProductReminder: build.mutation<number, ProductReminderRecord>({
      query: (data) => ({
        url: "/product-renews",
        method: "POST",
        body: data,
      }),
      onSuccess: () => {
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "add",
        });
      },
      onError: () => {
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "add",
        });
      },
      invalidatesKeys: () => ["product-renews"],
    }),
    updateProductReminder: build.mutation<void, RenewProductRecord>({
      query: ({ systemDetailID, ...reminderData }) => ({
        url: `/product-renews/${systemDetailID}`,
        method: "PATCH",
        body: reminderData,
      }),
      onSuccess: () =>
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "update",
        }),
      onError: () =>
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "update",
        }),

      invalidatesKeys: () => ["product-renews"],
    }),
    productRemindersForCustomer: build.query({
      query: ({ customerID, page }) => ({
        url: `/product-renews/customer/${customerID}`,
        params: {
          pageNumber: page,
          pageSize: ITEMS_AMOUNT_PER_TAB,
        },
      }),
      providesQueryKeys: ({ customerID, page }) => [
        "product-renews-for-customer",
        customerID,
        page,
      ],

      transformResponse: ({
        listSubset,
        totalAmountInDataBase,
      }: SubsetListType<ProductReminderRecord>) => ({
        productRenews: listSubset,
        totalItems: totalAmountInDataBase,
      }),
    }),
    renewProductReminder: build.mutation<void, RenewProductRecord>({
      query: ({ systemDetailID, ...data }) => ({
        url: `/product-renews/${systemDetailID}/renew`,
        method: "PATCH",
        body: data,
      }),
      invalidatesKeys: () => ["product-renews"],
      onSuccess: () =>
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "renew",
        }),

      onError: () =>
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "renew",
        }),
    }),
    productReminderInPeriod: build.query({
      query: ({
        daysBeforeExpiration,
        monthsAfterExpiration,
        page,
      }: {
        daysBeforeExpiration: number;
        monthsAfterExpiration: number;
        page: number;
      }) => ({
        url: "/product-renews/reminders",
        method: "GET",
        params: {
          daysBeforeExpiration,
          monthsAfterExpiration,
          pageNumber: page,
          pageSize: ITEMS_AMOUNT_PER_PAGE,
        },
      }),
      providesQueryKeys: ({
        daysBeforeExpiration,
        monthsAfterExpiration,
        page,
      }) => [
        "product-renews",
        daysBeforeExpiration,
        monthsAfterExpiration,
        page,
      ],
      transformResponse: (data: SubsetListType<ProductReminderRecord>) => ({
        productRenews: data.listSubset,
        totalItems: data.totalAmountInDataBase,
      }),
    }),
    deleteProductReminder: build.mutation({
      query: (reminderId: number) => ({
        url: `/product-renews/${reminderId}`,
        method: "DELETE",
      }),
      onSuccess: () =>
        translateToast({
          status: "success",
          titleKey: "toast-message-success",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "delete",
        }),
      onError: () =>
        translateToast({
          status: "error",
          titleKey: "toast-message-error",
          descriptionKey: "toast-title",
          translationNS: "productRenews",
          keyPrefix: "delete",
        }),
    }),
  }),
});

export const {
  useAddNewProductReminderMutation,
  useProductReminderInPeriodQuery,
  useProductRemindersForCustomerQuery,
  useRenewProductReminderMutation,
  useUpdateProductReminderMutation,
  useDeleteProductReminderMutation,
} = productRenewApi;
