import { Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TbEdit, TbPencilCheck } from "react-icons/tb";
import StyledModal from "../../../../components/StyledModal";
import { ServiceRenewRecord } from "../../../service-renews/serviceRenews";
import AddEditServiceContractForm from "./AddEditServiceContractForm";

function AddEditServiceContractModal({
  serviceRenewToEdit = {},
}: {
  serviceRenewToEdit?: ServiceRenewRecord | Record<string, never>;
}) {
  const { t } = useTranslation("serviceRenews");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isEditing = Object.keys(serviceRenewToEdit).length !== 0;

  return (
    <>
      <Button
        colorScheme='teal'
        onClick={onOpen}
        fontSize='1.3rem'
        gap={2}
        padding=' 0 1rem 0 1rem'
      >
        {serviceRenewToEdit.contractID ? (
          <TbEdit size='5rem' />
        ) : (
          <TbPencilCheck />
        )}
        {serviceRenewToEdit.contractID ? t("update.button") : t("add.button")}
      </Button>
      <StyledModal
        isOpen={isOpen}
        isEditing={isEditing}
        onClose={onClose}
        title={isEditing ? t("update.title") : t("add.title")}
        renderBody={(submitButtonRef) => (
          <AddEditServiceContractForm
            serviceRenewToEdit={serviceRenewToEdit}
            submitButtonRef={submitButtonRef}
            onSubmit={onClose}
          />
        )}
      />
    </>
  );
}

export default AddEditServiceContractModal;
