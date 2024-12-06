import { usePageNumber } from "../../../hooks/usePageNumber";
import { useServiceContractHistoryCustomerQuery } from "../../../services/redux/api/apiServiceRenew";
export function useServiceContractHistoryCustomer(
  customerId: number,
  itemsPerPage: number
) {
  const page = usePageNumber();
  const {
    data: { serviceContractRenews, totalItems } = {
      serviceContractRenews: [],
      totalItems: 0,
    },
    isLoading,
  } = useServiceContractHistoryCustomerQuery({
    customerId,
    itemsPerPage,
    page,
  });

  return { serviceContractRenews, totalItems, isLoading };
}
