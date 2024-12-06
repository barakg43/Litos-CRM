import { LegacyRef } from "react";
import {
  useAddNewProductReminderMutation,
  useUpdateProductReminderMutation,
} from "../../../../services/redux/api/apiProductRenew";
import ProductRenewPanel from "../../../product-renews/ProductRenewPanel";
import { useCustomerIdParam } from "../../hooks/useCustomerIdParam";

function AddEditProductReminderForm({
  submitButtonRef,
  productRenewToEdit = {},
  onSubmit,
}: {
  submitButtonRef: LegacyRef<HTMLButtonElement> | undefined;
  productRenewToEdit?: ProductReminderRecord | Record<string, never>;
  onSubmit?: () => void;
}) {
  const {
    notes1,
    notes2,
    notes3,
    notes4,
    price,
    productDetailDescription,
    validityTill,
    systemDetailID,
  } = productRenewToEdit;
  const customerID = useCustomerIdParam();
  const [addNewProductReminder, isAdding] = useAddNewProductReminderMutation();
  const [updateProductReminder, isUpdating] =
    useUpdateProductReminderMutation();
  const isLoading = isAdding || isUpdating;
  function onSubmitForm(data: RenewProductRecord) {
    if (productRenewToEdit.systemDetailID) {
      updateProductReminder({ ...data, systemDetailID });
    } else {
      addNewProductReminder({ ...data, customerID });
    }
    onSubmit?.();
  }

  return (
    <ProductRenewPanel
      systemDetailID={systemDetailID}
      productDetailDescription={productDetailDescription}
      price={price}
      notes1={notes1}
      notes2={notes2}
      notes3={notes3}
      notes4={notes4}
      validityTill={validityTill}
      submitButtonRef={submitButtonRef}
      onSubmit={onSubmitForm}
    />
  );
}

export default AddEditProductReminderForm;
