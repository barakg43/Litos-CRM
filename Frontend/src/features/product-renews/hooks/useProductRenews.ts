import { usePageNumber } from "../../../hooks/usePageNumber";
import { usePeriodExpirationParams } from "../../../hooks/usePeriodExpirationParams";
import { useProductReminderInPeriodQuery } from "../../../services/redux/api/apiProductRenew";

export function useProductRenews() {
  const page = usePageNumber();

  const { daysBeforeExpiration, monthsAfterExpiration } =
    usePeriodExpirationParams();
  const {
    data: { productRenews, totalItems } = {
      productRenews: [],
      totalItems: 0,
    },
    isLoading,
  } = useProductReminderInPeriodQuery({
    daysBeforeExpiration,
    monthsAfterExpiration,
    page,
  });
  //   useQuery({
  //     queryKey: [
  //       "product-renews",
  //       daysBeforeExpiration,
  //       monthsAfterExpiration,
  //       page,
  //     ],
  //     queryFn: () =>
  //       getAllProductReminderForPeriodTime_API({
  //         daysBeforeExpiration,
  //         monthsAfterExpiration,
  //         page,
  //       }),
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
