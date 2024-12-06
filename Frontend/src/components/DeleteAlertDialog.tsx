import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TbTrash } from "react-icons/tb";

type DeleteAlertDialogProps = {
  resourceName: string;
  isPending?: boolean;
  onConfirm: () => void;
};
function DeleteAlertDialog({
  resourceName,
  onConfirm,
  isPending = false,
}: DeleteAlertDialogProps) {
  const { t } = useTranslation("components");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  function handleDelete() {
    onConfirm();
    onClose();
  }
  return (
    <>
      <Button
        _focus={{ outline: "none", boxShadow: "none" }}
        isLoading={isPending}
        backgroundColor='red.300'
        _hover={{ backgroundColor: "red.500", color: "white" }}
        onClick={onOpen}
        fontSize={"xl"}
        padding={"0.5rem 2rem 0.5rem 2rem"}
      >
        <TbTrash />
        {t("buttons.delete")}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {t("buttons.delete")} {resourceName}
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              {t("delete-alert", { resourceName })}
            </AlertDialogBody>

            <AlertDialogFooter gap='1rem'>
              <Button ref={cancelRef} onClick={onClose}>
                {t("buttons.cancel")}
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                {t("buttons.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteAlertDialog;
