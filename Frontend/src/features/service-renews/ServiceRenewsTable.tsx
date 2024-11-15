import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/Pagination.tsx";
import CustomTable from "./../../components/CustomTable.tsx";
import ServiceRenewFormModal from "./ServiceRenewFormModal.tsx";
import ServiceRenewRow from "./ServiceRenewRow.tsx";
import { useServiceContractRenews } from "./hooks/useServiceContractRenews";
import { ServiceRenewRecord } from "./serviceRenews";
function ServiceRenewsTable() {
  const { serviceContractRenews, totalItems, isLoading } =
    useServiceContractRenews();
  const { t } = useTranslation("serviceRenews");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [serviceToRenew, setServiceToRenew] = useState<ServiceRenewRecord>();
  function handleRenew(serviceRenew: ServiceRenewRecord) {
    setServiceToRenew(serviceRenew);
    onOpen();
  }
  return (
    <>
      <Flex
        alignContent='center'
        justifyContent='flex-end'
        paddingBottom='10px'
        w='95%'
      >
        <ServiceRenewFormModal
          isOpen={isOpen}
          onClose={onClose}
          serviceRenew={serviceToRenew}
        />
      </Flex>
      <CustomTable columns={"1fr ".repeat(5)}>
        <CustomTable.Header>
          <CustomTable.Header.Cell label={t("customerShortName")} />
          <CustomTable.Header.Cell label={t("startDateOfContract")} />
          <CustomTable.Header.Cell label={t("finishDateOfContract")} />
          <CustomTable.Header.Cell label={t("periodKind")} />
        </CustomTable.Header>
        <CustomTable.Body
          data={serviceContractRenews}
          isLoading={isLoading}
          resourceName={t("title")}
          render={(serviceReminder: ServiceRenewRecord) => (
            <ServiceRenewRow
              customerID={serviceReminder.customerID}
              customerShortName={serviceReminder.customerShortName}
              contractID={serviceReminder.contractID}
              startDateOfContract={serviceReminder.startDateOfContract}
              finishDateOfContract={serviceReminder.finishDateOfContract}
              contractPrice={serviceReminder.contractPrice}
              periodKind={serviceReminder.periodKind}
              contractDescription={serviceReminder.contractDescription}
              key={serviceReminder.contractID}
              onRenew={handleRenew}
            />
          )}
        />

        <CustomTable.Footer>
          <Pagination totalItemsAmount={totalItems} />
        </CustomTable.Footer>
      </CustomTable>
    </>
  );
}

export default ServiceRenewsTable;
