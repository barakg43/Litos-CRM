import { HStack, Stack, StackDivider } from "@chakra-ui/react";
import { LegacyRef } from "react";
import { useTranslation } from "react-i18next";
import { DetailRow } from "../../components/DetailRow";
import { useRenewProductReminderMutation } from "../../services/redux/api/apiProductRenew";
import ProductRenewPanel from "./ProductRenewPanel";

function ProductRenewForm({
  submitButtonRef,
  productRenew = {},
  onSubmit,
}: {
  submitButtonRef: LegacyRef<HTMLButtonElement> | undefined;
  productRenew?: ProductReminderRecord | Record<string, never>;
  onSubmit?: () => void;
}) {
  const [renewProductReminder] = useRenewProductReminderMutation();

  const {
    custShortName,
    systemDetailID,
    productDetailDescription,
    validityTill,
    notes1,
    notes2,
    notes3,
    notes4,
  } = productRenew;
  const { t } = useTranslation("productRenews");
  function handleRenew(data: RenewProductRecord) {
    renewProductReminder(data);
    onSubmit?.();
  }
  return (
    <Stack divider={<StackDivider />} spacing='3'>
      <HStack divider={<StackDivider />}>
        <DetailRow label={t("custShortName")} value={custShortName} />
        <DetailRow
          label={t("productDetailDescription")}
          value={productDetailDescription}
        />
        <DetailRow
          label={t("validityTill")}
          value={new Date(validityTill).toLocaleDateString()}
        />
      </HStack>
      <HStack divider={<StackDivider />}>
        <DetailRow label={t("notes1")} value={notes1} />
        <DetailRow label={t("notes2")} value={notes2} />
        <DetailRow label={t("notes3")} value={notes3} />
        <DetailRow label={t("notes4")} value={notes4} />
      </HStack>
      <ProductRenewPanel
        systemDetailID={systemDetailID}
        productDetailDescription={productDetailDescription}
        notes1={notes1}
        notes2={notes2}
        notes3={notes3}
        notes4={notes4}
        submitButtonRef={submitButtonRef}
        onSubmit={handleRenew}
      />
    </Stack>
  );
}
export default ProductRenewForm;
