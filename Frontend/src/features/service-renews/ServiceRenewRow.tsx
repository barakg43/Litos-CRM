import { Button, Tag } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../components/CustomTable";
import CustomerNameCell from "../../components/CustomerNameCell";
import { ServiceRenewRecord } from "./serviceRenews";

const periodColors = {
  MONTHLY: "blue",
  QUARTERLY: "green",
  YEARLY: "gray",
};
interface ServiceRowProps extends ServiceRenewRecord {
  onRenew: (serviceRenew: ServiceRenewRecord) => void;
}
function ServiceRenewRow({
  contractID,
  customerID,
  customerShortName,
  contractDescription,
  finishDateOfContract,
  startDateOfContract,
  contractPrice,
  periodKind,
  onRenew,
}: ServiceRowProps) {
  const { t } = useTranslation("serviceRenews");
  const Cell = CustomTable.Row.Cell;
  function handleRenew() {
    onRenew({
      contractID,
      customerID,
      customerShortName,
      startDateOfContract,
      finishDateOfContract,
      contractPrice,
      periodKind,
      contractDescription,
    });
  }
  return (
    <CustomTable.Row>
      <CustomerNameCell
        customerID={customerID}
        customerName={customerShortName}
      />
      <Cell>{new Date(startDateOfContract).toLocaleDateString("en-GB")}</Cell>
      <Cell>{new Date(finishDateOfContract).toLocaleDateString("en-GB")}</Cell>
      <Cell>
        <Tag
          backgroundColor={periodColors[periodKind]}
          justifyContent='center'
          size='xl'
          borderRadius='full'
          padding='0.5rem 0 0.5rem 0'
          w={"15rem"}
          margin='auto'
          color={`${periodColors[periodKind]}.50`}
        >
          {t("period." + periodKind)}
        </Tag>
      </Cell>
      <Cell>
        <Button
          _focus={{ outline: "none", boxShadow: "none" }}
          _hover={{ backgroundColor: "teal.500", color: "white" }}
          onClick={handleRenew}
          fontSize={"xl"}
          padding={"0.5rem 3rem 0.5rem 3rem"}
        >
          {t("renew-button")}
        </Button>
      </Cell>
    </CustomTable.Row>
  );
}

export default ServiceRenewRow;
