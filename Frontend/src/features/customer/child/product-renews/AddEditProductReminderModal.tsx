import { Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TbEdit, TbPencilCheck } from "react-icons/tb";
import StyledModal from "../../../../components/StyledModal";
import AddEditProductReminderForm from "./AddEditProductReminderForm";

function AddEditProductReminderModal({
  productRenewToEdit = {},
}: {
  productRenewToEdit?: ProductReminderRecord | Record<string, never>;
}) {
  const { t } = useTranslation("productRenews");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isEditing = Object.keys(productRenewToEdit).length !== 0;

  return (
    <>
      <Button
        colorScheme='teal'
        onClick={onOpen}
        fontSize='1.3rem'
        gap={2}
        padding=' 0 1rem 0 1rem'
      >
        {productRenewToEdit.systemDetailID ? (
          <>
            <TbEdit size='1.5rem' />
            {t("update.button")}
          </>
        ) : (
          <>
            <TbPencilCheck />
            {t("add.button")}
          </>
        )}
      </Button>
      <StyledModal
        isOpen={isOpen}
        isEditing={isEditing}
        onClose={onClose}
        title={isEditing ? t("update.title") : t("add.title")}
        renderBody={(submitButtonRef) => (
          <AddEditProductReminderForm
            productRenewToEdit={productRenewToEdit}
            submitButtonRef={submitButtonRef}
            onSubmit={onClose}
          />
        )}
      />
    </>
  );
}

export default AddEditProductReminderModal;
