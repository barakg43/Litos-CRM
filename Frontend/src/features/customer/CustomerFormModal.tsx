import { Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import StyledModal from "../../components/StyledModal";
import { CustomerFullDataType } from "../customers/customers";
import CustomerForm from "./CustomerForm";

function CustomerFormModal({
  customerToEdit = {},
}: {
  customerToEdit?: CustomerFullDataType | Record<string, never>;
}) {
  const { t } = useTranslation("customers");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isEditing = Object.keys(customerToEdit).length !== 0;

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen} fontSize='1.2rem'>
        {customerToEdit.customerID ? t("update.edit") : t("add.button")}
      </Button>
      <StyledModal
        isOpen={isOpen}
        isEditing={isEditing}
        onClose={onClose}
        title={isEditing ? t("update.title") : t("add.title")}
        renderBody={(submitButtonRef) => (
          <CustomerForm
            customerToEdit={customerToEdit}
            submitRef={submitButtonRef}
            OnSubmit={onClose}
          />
        )}
      />
    </>
  );
}

export default CustomerFormModal;
