import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../../components/CustomTable.tsx";
import Pagination from "../../../../components/Pagination.tsx";
import { ITEMS_AMOUNT_PER_TAB } from "../../../../services/globalTypes";
import { useCustomerDetailsQuery } from "../../../../services/redux/api/apiCustomers.ts";
import { useServiceContractHistoryCustomer } from "../../../service-renews/hooks/useServiceContractHistoryCustomer.ts";
import { ServiceRenewRecord } from "../../../service-renews/serviceRenews";
import { useCustomerIdParam } from "../../hooks/useCustomerIdParam.ts";
import AddEditServiceContractModal from "./AddEditServiceContractModal.tsx";
import ServiceRenewHistoryRow from "./ServiceRenewHistoryRow.tsx";

function ServiceRenewsHistoryTable() {
  const customerId = useCustomerIdParam();

  const {
    serviceContractRenews,
    isLoading: isLoadingHistory,
    totalItems,
  } = useServiceContractHistoryCustomer(customerId, ITEMS_AMOUNT_PER_TAB);
  const { t } = useTranslation("serviceRenews");

  const { data: { activeContractID } = {}, isLoading: isLoadingCustomer } =
    useCustomerDetailsQuery(customerId);
  const isLoading = isLoadingCustomer || isLoadingHistory;
  return (
    <>
      {!activeContractID && (
        <Flex
          alignContent='center'
          justifyContent='flex-end'
          paddingBottom='10px'
          w='95%'
        >
          <AddEditServiceContractModal />
        </Flex>
      )}
      <CustomTable columns={"0.5fr 1fr 1fr 5fr 1fr 1.5fr"}>
        <CustomTable.Header>
          <CustomTable.Header.Cell
            sx={{ fontSize: "small" }}
            label={t("contractID")}
          />
          <CustomTable.Header.Cell
            sx={{ fontSize: "small" }}
            label={t("startDateOfContract")}
          />
          <CustomTable.Header.Cell
            sx={{ fontSize: "small" }}
            label={t("finishDateOfContract")}
          />
          <CustomTable.Header.Cell
            sx={{ fontSize: "small" }}
            label={t("contractDescription")}
          />
          <CustomTable.Header.Cell
            sx={{ fontSize: "small" }}
            label={t("contractPrice")}
          />
        </CustomTable.Header>

        <CustomTable.Body
          data={serviceContractRenews}
          isLoading={isLoading}
          resourceName={t("title")}
          render={(serviceReminder: ServiceRenewRecord) => (
            <ServiceRenewHistoryRow
              serviceReminder={serviceReminder}
              isActiveContract={serviceReminder.contractID === activeContractID}
              key={serviceReminder.contractID}
            />
          )}
        />

        <CustomTable.Footer>
          <Pagination
            totalItemsAmount={totalItems}
            itemsPerPage={ITEMS_AMOUNT_PER_TAB}
          />
        </CustomTable.Footer>
      </CustomTable>
    </>
  );
}

export default ServiceRenewsHistoryTable;
