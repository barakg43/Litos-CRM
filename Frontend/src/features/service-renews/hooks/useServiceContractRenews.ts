import { usePageNumber } from "../../../hooks/usePageNumber";
import { usePeriodExpirationParams } from "../../../hooks/usePeriodExpirationParams";
import { useServiceRenewForPeriodTimeQuery } from "../../../services/redux/api/apiServiceRenew";

export function useServiceContractRenews() {
  const page = usePageNumber();
  const { daysBeforeExpiration, monthsAfterExpiration } =
    usePeriodExpirationParams();
  const {
    data: { serviceContractRenews, totalItems } = {
      serviceContractRenews: [],
      totalItems: 0,
    },
    isLoading,
  } = useServiceRenewForPeriodTimeQuery({
    daysBeforeExpiration,
    monthsAfterExpiration,
    page,
  });

  return { serviceContractRenews, totalItems, isLoading };
}
