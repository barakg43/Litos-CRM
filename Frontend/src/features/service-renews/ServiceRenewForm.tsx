import { HStack, Stack, StackDivider } from "@chakra-ui/react";
import { LegacyRef } from "react";
import { useTranslation } from "react-i18next";
import { DetailRow } from "../../components/DetailRow";
import RenewServicePanel from "./RenewServicePanel";
import { ServiceRenewRecord } from "./serviceRenews";
function ServiceRenewForm({
  submitButtonRef,
  serviceRenew = {},
  onSubmit,
}: {
  submitButtonRef: LegacyRef<HTMLButtonElement> | undefined;
  serviceRenew?: ServiceRenewRecord | Record<string, never>;
  onSubmit?: () => void;
}) {
  const {
    contractDescription,
    contractID,
    contractPrice,
    finishDateOfContract,
    periodKind,
    startDateOfContract,
  } = serviceRenew;
  const { t } = useTranslation("serviceRenews");

  return (
    <Stack divider={<StackDivider />} spacing='3'>
      <HStack divider={<StackDivider />}>
        <DetailRow
          label={t("startDateOfContract")}
          value={new Date(startDateOfContract).toLocaleDateString()}
        />
        <DetailRow
          label={t("finishDateOfContract")}
          value={new Date(finishDateOfContract).toLocaleDateString()}
        />

        <DetailRow label={t("periodKind")} value={t("period." + periodKind)} />
      </HStack>
      <HStack divider={<StackDivider />}>
        <DetailRow label={t("contractPrice")} value={contractPrice} />
        <DetailRow
          label={t("contractDescription")}
          value={contractDescription}
        />
      </HStack>
      <RenewServicePanel
        contractID={contractID}
        submitButtonRef={submitButtonRef}
        onSubmit={onSubmit}
        contractPrice={contractPrice}
        defaultPeriodKind={periodKind}
      />
    </Stack>
  );
}
export default ServiceRenewForm;
