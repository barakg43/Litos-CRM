import { Button, Flex, VStack } from "@chakra-ui/react";
import { LegacyRef } from "react";
import { useForm } from "react-hook-form";
import ExtendFormRow from "../../components/ExtendFormRow";
import { useRenewServiceReminderMutation } from "../../services/redux/api/apiServiceRenew";
import PeriodSelector from "./PeriodSelector";
import { PeriodType, RenewServiceContract } from "./serviceRenews";
export type RenewPanelProps = {
  contractID?: number;
  defaultPeriodKind: PeriodType;
  submitButtonRef: LegacyRef<HTMLButtonElement> | undefined;
  contractPrice: number;
  onSubmit?: () => void;
};
function RenewServicePanel({
  contractID,
  contractPrice,
  defaultPeriodKind,
  submitButtonRef,
  onSubmit,
}: RenewPanelProps) {
  const [renewServiceContract] = useRenewServiceReminderMutation();
  // const {} = useRadioGroup();
  const { register, handleSubmit, formState, reset } =
    useForm<RenewServiceContract>();
  const { errors } = formState;
  function onRenew({
    contractPrice,
    periodKind,
    contractDescription,
  }: RenewServiceContract) {
    if (errors && Object.keys(errors).length > 0) return;
    renewServiceContract({
      contractID,
      contractPrice,
      periodKind,
      contractDescription,
    });
    reset();
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit(onRenew)}>
      <Flex grow={1} gap={6} fontSize='2xl'>
        <VStack>
          <ExtendFormRow
            fieldName='contractDescription'
            registerFn={register}
            translationNS='serviceRenews'
            error={errors?.contractDescription}
            type='textarea'
          />
          <ExtendFormRow
            fieldName='contractPrice'
            registerFn={register}
            translationNS='serviceRenews'
            error={errors?.contractPrice}
            defaultValue={contractPrice}
            type='number'
          />
        </VStack>
        <PeriodSelector
          defaultValue={defaultPeriodKind}
          register={register("periodKind")}
        />
        <Button ref={submitButtonRef} display='none' type='submit' />
      </Flex>
    </form>
  );
}
export default RenewServicePanel;
