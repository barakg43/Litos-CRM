import CustomTable from "../../../../components/CustomTable";
import { calculateForwardDateByMonthsAndDays } from "../../../../services/utils";
import AddEditProductReminderModal from "./AddEditProductReminderModal";

interface ProductHistoryRowProps {
  productToRenew: ProductReminderRecord;
}
function ProductHistoryRow({ productToRenew }: ProductHistoryRowProps) {
  const { productDetailDescription, systemDetailID, price, validityTill } =
    productToRenew;
  const Cell = CustomTable.Row.Cell;
  const isFutureValidityDateHeadMonth =
    validityTill &&
    calculateForwardDateByMonthsAndDays({
      startDate: validityTill,
      months: 1,
    }).getTime() >= Date.now();

  return (
    <CustomTable.Row height='100%'>
      <Cell sx={{ padding: 1 }}>{systemDetailID}</Cell>
      <Cell sx={{ padding: 1 }}>{productDetailDescription}</Cell>
      <Cell sx={{ padding: 1 }}>{price}</Cell>
      <Cell sx={{ padding: 1 }}>
        {validityTill
          ? new Date(validityTill).toLocaleDateString("en-GB")
          : "-"}
      </Cell>
      <Cell sx={{ padding: 1 }}>
        {isFutureValidityDateHeadMonth ? (
          <AddEditProductReminderModal productRenewToEdit={productToRenew} />
        ) : null}
      </Cell>
    </CustomTable.Row>
  );
}

export default ProductHistoryRow;
