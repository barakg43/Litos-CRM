import { Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../components/CustomTable";
import CustomerNameCell from "../../components/CustomerNameCell";
import ProductRenewFormModal from "./ProductRenewFormModal";

interface ProductRenewRowProps {
  productToRenew: ProductReminderRecord;
}
function ProductRenewRow({ productToRenew }: ProductRenewRowProps) {
  const {
    custShortName,
    customerID,
    productDetailDescription,
    systemDetailID,
    validityTill,
  } = productToRenew;
  const { t } = useTranslation("productRenews", { keyPrefix: "renew-table" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Cell = CustomTable.Row.Cell;
  return (
    <>
      <ProductRenewFormModal
        isOpen={isOpen}
        onClose={onClose}
        title={t("header")}
        productRenew={productToRenew}
      />
      <CustomTable.Row>
        <Cell>{systemDetailID}</Cell>
        <CustomerNameCell
          customerID={customerID}
          customerName={custShortName}
        />
        <Cell>{productDetailDescription}</Cell>
        <Cell>{new Date(validityTill).toLocaleDateString("en-GB")}</Cell>
        <Cell>
          <Button
            _focus={{ outline: "none", boxShadow: "none" }}
            _hover={{ backgroundColor: "teal.500", color: "white" }}
            onClick={onOpen}
            fontSize={"xl"}
            padding={"0.5rem 3rem 0.5rem 3rem"}
          >
            {t("renew-button")}
          </Button>
        </Cell>
      </CustomTable.Row>
    </>
  );
}

export default ProductRenewRow;
