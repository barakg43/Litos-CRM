import { HStack, SystemStyleObject, Text } from "@chakra-ui/react";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";

export function DetailRow({
  label,
  value,
  sx,
}: {
  label: string;
  value:
    | string
    | number
    | boolean
    | ReactElement<never, string | JSXElementConstructor<unknown>>
    | Iterable<ReactNode>
    | ReactPortal
    | null
    | undefined;
  useDivider?: boolean;
  sx?: SystemStyleObject | undefined;
}) {
  return (
    <HStack sx={sx} as='span'>
      <Text as='span' fontWeight={600}>
        {label}:
      </Text>
      <Text> {value}</Text>
    </HStack>
  );
}
