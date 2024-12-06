import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ReactElement, RefObject, useRef } from "react";
import { useTranslation } from "react-i18next";

function StyledModal({
  isEditing = false,
  isOpen,
  onClose,
  renderBody,
  title,
}: {
  renderBody?: (submitButtonRef: RefObject<HTMLButtonElement>) => ReactElement;
  title?: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
}) {
  const { t } = useTranslation("components", { keyPrefix: "buttons" });
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
      />
      <ModalContent minWidth={"50%"}>
        {title && (
          <ModalHeader marginInlineStart='2rem' fontSize='1.6rem'>
            {title}
          </ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody>{renderBody?.(submitButtonRef)}</ModalBody>
        <ModalFooter gap='1rem'>
          <Button fontSize='1rem' onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            fontSize='1.1rem'
            fontWeight='bold'
            onClick={() => {
              submitButtonRef.current?.click();
            }}
          >
            {isEditing ? t("update") : t("save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default StyledModal;
