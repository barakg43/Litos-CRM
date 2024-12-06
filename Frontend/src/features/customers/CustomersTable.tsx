import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../components/CustomTable";
import Pagination from "../../components/Pagination";
import CustomerFormModal from "../customer/CustomerFormModal";
import CustomerRow from "./CustomerRow";
import { useCustomers } from "./hooks/useCustomers";
// eslint-disable-next-line react-refresh/only-export-components
export const customerStatuses = [
  "IN_SERVICE",
  "OUT_OF_SERVICE",
  "BANK_HOURS",
  "CLOUD_SERVER",
  "CLOUD_MAIL",
  "CHARGE",
] as const;

function CustomersTable() {
  const { customers, isLoading, totalItems } = useCustomers();
  const { t } = useTranslation("customers", { keyPrefix: "table" });
  return (
    <>
      <Flex
        alignContent='center'
        justifyContent='flex-end'
        paddingBottom='10px'
        w='95%'
      >
        <CustomerFormModal />
      </Flex>
      <CustomTable columns={"1fr ".repeat(5)}>
        <CustomTable.Header>
          <CustomTable.Header.Cell label={t("customerId")} />
          <CustomTable.Header.Cell label={t("customerName")} />
          <CustomTable.Header.Cell label={t("address")} />
          <CustomTable.Header.Cell label={t("city")} />
          <CustomTable.Header.Cell label={t("status")} />
        </CustomTable.Header>

        <CustomTable.Body
          data={customers}
          resourceName={t("title")}
          isLoading={isLoading}
          render={(customer) => (
            <CustomerRow
              customerID={customer.customerID}
              customerShortName={customer.customerShortName}
              address={customer.address}
              city={customer.city}
              customerStatus={customer.customerStatus}
              key={customer.customerID}
            />
          )}
        />

        <CustomTable.Footer>
          <Pagination as='td' totalItemsAmount={totalItems} />
        </CustomTable.Footer>
      </CustomTable>
    </>
  );
}

export default CustomersTable;
