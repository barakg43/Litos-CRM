import { useTranslation } from "react-i18next";
import CustomTable from "../../components/CustomTable";
import Pagination from "../../components/Pagination";
import { ITEMS_AMOUNT_PER_PAGE } from "../../services/globalTypes";
import ProductRenewRow from "./ProductRenewRow";
import { useProductRenews } from "./hooks/useProductRenews";

function ProductRenewTable() {
  const { productRenews, totalItems, isLoading } = useProductRenews();
  const { t } = useTranslation("productRenews");

  return (
    <CustomTable columns={"1fr ".repeat(5)}>
      <CustomTable.Header>
        <CustomTable.Header.Cell label={t("systemDetailID")} />
        <CustomTable.Header.Cell label={t("custShortName")} />
        <CustomTable.Header.Cell label={t("productDetailDescription")} />
        <CustomTable.Header.Cell label={t("validityTill")} />
      </CustomTable.Header>
      <CustomTable.Body
        data={productRenews}
        isLoading={isLoading}
        resourceName={t("title")}
        render={(productReminder: ProductReminderRecord) => (
          <ProductRenewRow
            productToRenew={productReminder}
            key={productReminder.systemDetailID}
          />
        )}
      />

      <CustomTable.Footer>
        <Pagination
          totalItemsAmount={totalItems}
          itemsPerPage={ITEMS_AMOUNT_PER_PAGE}
        />
      </CustomTable.Footer>
    </CustomTable>
  );
}

export default ProductRenewTable;
