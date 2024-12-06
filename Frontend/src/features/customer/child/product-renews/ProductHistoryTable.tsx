import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../../components/CustomTable";
import Pagination from "../../../../components/Pagination";
import { ITEMS_AMOUNT_PER_TAB } from "../../../../services/globalTypes";
import { useProductRenewForCustomer } from "../../../product-renews/hooks/useProductRenewForCustomer";
import AddEditProductReminderModal from "./AddEditProductReminderModal";
import ProductHistoryRow from "./ProductHistoryRow";

function ProductHistoryTable() {
  const { productRenews, isLoading, totalItems } = useProductRenewForCustomer();
  const { t } = useTranslation("productRenews");
  return (
    <>
      <Flex
        alignContent='center'
        justifyContent='flex-end'
        paddingBottom='10px'
        w='95%'
      >
        <AddEditProductReminderModal />
      </Flex>

      <CustomTable columns={"1fr ".repeat(5)}>
        <CustomTable.Header>
          <CustomTable.Header.Cell label={t("systemDetailID")} />
          <CustomTable.Header.Cell label={t("productDetailDescription")} />
          <CustomTable.Header.Cell label={t("price")} />
          <CustomTable.Header.Cell label={t("validityTill")} />
        </CustomTable.Header>
        <CustomTable.Body
          data={productRenews}
          isLoading={isLoading}
          resourceName={t("title")}
          render={(productReminder) => (
            <ProductHistoryRow
              productToRenew={productReminder}
              key={productReminder.systemDetailID}
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

export default ProductHistoryTable;
