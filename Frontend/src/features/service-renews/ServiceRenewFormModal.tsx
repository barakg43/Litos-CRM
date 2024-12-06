import { useTranslation } from "react-i18next";
import StyledModal from "../../components/StyledModal";
import ServiceRenewForm from "./ServiceRenewForm";
import { ServiceRenewRecord } from "./serviceRenews";

function ServiceRenewFormModal({
  isOpen,
  onClose,
  serviceRenew = {},
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceRenew?: ServiceRenewRecord | Record<string, never>;
}) {
  const { t } = useTranslation("serviceRenews");
  const isEditing = Object.keys(serviceRenew).length !== 0;

  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      isEditing={isEditing}
      title={isEditing ? t("update.title") : t("add.title")}
      renderBody={(submitButtonRef) => (
        <ServiceRenewForm
          submitButtonRef={submitButtonRef}
          serviceRenew={serviceRenew}
          onSubmit={onClose}
        />
      )}
    />
  );
}

export default ServiceRenewFormModal;
