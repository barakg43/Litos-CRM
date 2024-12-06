import StyledModal from "../../components/StyledModal";
import ProductRenewForm from "./ProductRenewForm";

function ProductRenewFormModal({
  isOpen,
  onClose,
  title,
  productRenew = {},
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  productRenew?: ProductReminderRecord | Record<string, never>;
}) {
  const isEditing = Object.keys(productRenew).length !== 0;

  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      isEditing={isEditing}
      title={title}
      renderBody={(submitButtonRef) => (
        <ProductRenewForm
          submitButtonRef={submitButtonRef}
          productRenew={productRenew}
          onSubmit={onClose}
        />
      )}
    />
  );
}

export default ProductRenewFormModal;
