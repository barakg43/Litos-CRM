import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../../components/CustomTable";
import DeleteAlertDialog from "../../../../components/DeleteAlertDialog";
import { useDeleteServiceContractMutation } from "../../../../services/redux/api/apiServiceRenew";
import { ServiceRenewRecord } from "../../../service-renews/serviceRenews";
import AddEditServiceContractModal from "./AddEditServiceContractModal";

interface ServiceRenewHistoryProps {
  serviceReminder: ServiceRenewRecord;
  isActiveContract?: boolean | undefined;
}
function ServiceRenewHistoryRow({
  serviceReminder,
  isActiveContract = false,
}: ServiceRenewHistoryProps) {
  const { t } = useTranslation("serviceRenews");
  const [deleteServiceContract, isDeleting] =
    useDeleteServiceContractMutation();
  const fontSize = "small";
  const Cell = CustomTable.Row.Cell;
  const {
    contractID,
    contractDescription,
    finishDateOfContract,
    startDateOfContract,
    contractPrice,
  } = serviceReminder;
  function handleDelete() {
    deleteServiceContract(contractID || -1);
  }
  return (
    <CustomTable.Row height={"100%"} sx={{ textAlign: "center" }}>
      <Cell sx={{ padding: 0 }} fontSize={fontSize}>
        {contractID}
      </Cell>
      <Cell sx={{ padding: 0 }} fontSize={fontSize}>
        {new Date(startDateOfContract).toLocaleDateString("en-GB")}
      </Cell>
      <Cell sx={{ padding: 0 }} fontSize={fontSize}>
        {new Date(finishDateOfContract).toLocaleDateString("en-GB")}
      </Cell>
      <Cell fontSize={fontSize} sx={{ w: "60.5%", padding: 0 }}>
        <Tooltip label={contractDescription} fontSize='lg' p={1}>
          <Text
            wordBreak='break-word'
            whiteSpace='normal'
            overflow='hidden'
            noOfLines={2}
            textOverflow='ellipsis'
            // padding={1}
          >
            {contractDescription}
          </Text>
        </Tooltip>
      </Cell>
      <Cell sx={{ padding: 1 }} fontSize={fontSize}>
        {contractPrice}
      </Cell>
      <Cell>
        {isActiveContract && (
          <Flex
            alignContent='center'
            justifyContent='flex-end'
            paddingBottom='10px'
            gap='1rem'
            w='95%'
          >
            <DeleteAlertDialog
              isPending={isDeleting}
              onConfirm={handleDelete}
              resourceName={t("title")}
            />

            <AddEditServiceContractModal serviceRenewToEdit={serviceReminder} />
          </Flex>
        )}
        {/* <Button
          _focus={{ outline: "none", "box-shadow": "none" }}
          isLoading={isPending}
          _hover={{ backgroundColor: "teal.500", color: "white" }}
          onClick={handleDelete}
          fontSize={"xl"}
          padding={"0.5rem 3rem 0.5rem 3rem"}
        >
          {t("delete")}
        </Button> */}
      </Cell>
    </CustomTable.Row>
  );
}

export default ServiceRenewHistoryRow;
