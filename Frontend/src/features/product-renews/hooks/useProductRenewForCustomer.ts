import { usePageNumber } from "../../../hooks/usePageNumber";
import { useProductRemindersForCustomerQuery } from "../../../services/redux/api/apiProductRenew";
import { useCustomerIdParam } from "../../customer/hooks/useCustomerIdParam";

export function useProductRenewForCustomer() {
  const customerID = useCustomerIdParam();
  const page = usePageNumber();
  const {
    data: { productRenews, totalItems } = {
      productRenews: [],
      totalItems: 0,
    },
    isLoading,
  } = useProductRemindersForCustomerQuery({
    customerID,
    page,
  });
  //   }: UseQueryResult<
  //     SubsetListType<ProductReminderRecord> | never | undefined
  //   > = useQuery({
  //     queryKey: ["product-renews-for-customer", customerID, page],
  //     queryFn: () => getProductRemindersByCustomerId_API({ customerID, page }),
  //   });
  //   if (error) {
  //     toast({
  //       title: t("error-message-fetch"),
  //       // description: t("error-message-fetch"),
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }

  return { productRenews, totalItems, isLoading };
}
