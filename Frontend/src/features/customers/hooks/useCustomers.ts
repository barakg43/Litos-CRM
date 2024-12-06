import { useToast } from "@chakra-ui/react";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { usePageNumber } from "../../../hooks/usePageNumber";
import { ITEMS_AMOUNT_PER_PAGE } from "../../../services/globalTypes";
import { useCustomersListQuery } from "../../../services/redux/api/apiCustomers";
import { getPagesAmount } from "../../../services/utils";

export function useCustomers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = usePageNumber();
  const toast = useToast();
  const querySearch = searchParams.get("query") || undefined;

  const debouncedQuery = useDebounce(querySearch, 300);
  useEffect(() => {
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }, [debouncedQuery]);
  const {
    data: { customers, totalItems } = { customers: [], totalItems: 0 },
    isLoading,
    error,
    prefetchQuery,
  } = useCustomersListQuery({
    page,
    querySearch: debouncedQuery,
  });
  //   const {
  //     data: { customers, totalItems } = { customers: [], totalItems: 0 },
  //     isLoading,
  //     error,
  //   }: UseQueryResult<CustomersListType> = useQuery({
  //     queryKey: ["customers", page, debouncedQuery],
  //     queryFn: ({ signal }) =>
  //       getCustomersSubset_API({ page, querySearch: debouncedQuery, signal }),
  //   });
  if (error) {
    toast({
      title: "Error occurred",
      description: "there are error when fetching customer data",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
  const pageCount = getPagesAmount(totalItems, ITEMS_AMOUNT_PER_PAGE);
  if (page < pageCount) prefetchQuery({ page: page + 1, querySearch });

  if (page > 1) prefetchQuery({ page: page - 1, querySearch });

  return { customers, totalItems, isLoading, error };
}
