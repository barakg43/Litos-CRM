import { Button, Flex, VStack } from "@chakra-ui/react";
import { LegacyRef } from "react";
import { useForm } from "react-hook-form";
import ExtendFormRow from "../../components/ExtendFormRow";
import PeriodSelector from "./PeriodSelector";
import { useRenewServiceContract } from "./hooks/useRenewServiceContract";
import { PeriodType, RenewServiceContract } from "./serviceRenews";
export type RenewPanelProps = {
  contractID: number;
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
  const { renewServiceContract } = useRenewServiceContract();
  // const {} = useRadioGroup();
  const { register, handleSubmit, formState, reset } =
    useForm<RenewServiceContract>();
  const { errors } = formState;
  function onRenew({
    contractPrice,
    periodKind,
    contactDescription,
  }: RenewServiceContract) {
    console.log(
      "test",
      contractID,
      contractPrice,
      periodKind,
      contactDescription
    );

    if (errors && Object.keys(errors).length > 0) return;
    renewServiceContract({
      contractID,
      contractPrice,
      periodKind,
      contactDescription,
    });
    reset();
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit(onRenew)}>
      <Flex grow={1} gap={6} fontSize='2xl'>
        <VStack>
          <ExtendFormRow
            label='contactDescription'
            register={register}
            translationNS='serviceRenews'
            error={errors?.contactDescription}
            type='textarea'
          />
          <ExtendFormRow
            label='contractPrice'
            register={register}
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
        <Button
          ref={submitButtonRef}
          onClick={() => console.log("click submit")}
          display='none'
          type='submit'
        />
      </Flex>
    </form>
  );
}
export default RenewServicePanel;
