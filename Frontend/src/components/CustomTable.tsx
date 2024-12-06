import {
  LayoutProps,
  ResponsiveValue,
  SystemStyleObject,
  Table,
  Tbody,
  Td,
  Tfoot,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TFunction } from "i18next";
import { MouseEventHandler, ReactNode, createContext, useContext } from "react";
import Empty from "./Empty";
import LoadingSpinner from "./LoadingSpinner";

function CustomTable({ columns, children, variant }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <Table
        fontSize='xl'
        w='95%'
        paddingTop='var(--scale-3)'
        variant={variant}
      >
        {children}
      </Table>
    </TableContext.Provider>
  );
}
type ValueType = {
  columns: string;
};
const TableContext = createContext<ValueType>({ columns: "" });

function Footer({ children }: { children: ReactNode }) {
  return (
    <Tfoot>
      <Tr>{children}</Tr>
    </Tfoot>
  );
}

type BodyProps<T> = {
  data: T[] | null | undefined;
  render: (item: T, index: number) => JSX.Element;
  isLoading: boolean;
  resourceName?: string | undefined;
};

type fontSizeProp =
  | ResponsiveValue<
      | number
      | "small"
      | (string & Record<string, never>)
      | "-moz-initial"
      | "inherit"
      | "initial"
      | "revert"
      | "revert-layer"
      | "unset"
      | "large"
      | "medium"
      | "x-large"
      | "x-small"
      | "xx-large"
      | "xx-small"
      | "xxx-large"
      | "larger"
      | "smaller"
    >
  | undefined;
type BodyTableCellProps = {
  onClick?: MouseEventHandler<HTMLTableCellElement> | undefined;
  fontSize?: fontSizeProp | undefined;
  children: ReactNode | undefined;
  sx?: SystemStyleObject | undefined;
};
function BodyTableCell({
  children,
  onClick,
  fontSize = "medium",
  sx,
}: BodyTableCellProps) {
  return (
    <Td
      textAlign='center'
      lineHeight='unset'
      onClick={onClick}
      fontSize={fontSize}
      border='none'
      sx={sx}
    >
      {children}
    </Td>
  );
}

function Body<T>({ data, render, resourceName, isLoading }: BodyProps<T>) {
  if (isLoading) return <LoadingSpinner />;
  if (data == undefined || data == null || data.length == 0) return;
  <tbody>
    <Empty resource={resourceName || "table"} as={"tr"} />;
  </tbody>;

  return (
    <Tbody margin='0.4rem 0' minHeight='85vh'>
      {data.map(render)}
    </Tbody>
  );
}

type TableProps = {
  columns: string;
  children: ReactNode;
  variant?: ResponsiveValue<string> | undefined;
};
function HeaderCell({
  label,
  sx,
}: {
  label: string;
  sx?: SystemStyleObject | undefined;
}) {
  return (
    <Td border='none' as={"th"} textAlign='center' sx={sx}>
      {label}
    </Td>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { columns } = useContext(TableContext);
  return (
    <Thead>
      <Tr
        display='grid'
        gridTemplateColumns={columns}
        fontSize='1.6rem'
        // columnGap='var(--scale-000)'
        alignItems='center'
        textAlign='center'
        // padding='var(--scale-0)'
        borderRadius='var(--radius-md) var(--radius-md) 0 0'
        background='var(--color-primary-300)'
      >
        {children}
      </Tr>
    </Thead>
  );
}
function TranslateLabelsHeader({
  t,
  labels,
}: {
  t: TFunction<string, string>;
  labels: string[];
}) {
  return (
    <CustomTable.Header>
      {labels.map((label) => (
        <CustomTable.Header.Cell
          label={t(label)}
          key={label}
          sx={{ width: "15rem" }}
        />
      ))}
    </CustomTable.Header>
  );
}

type RowType = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  height?: React.PropsWithoutRef<LayoutProps["height"]> | undefined;
  sx?: SystemStyleObject | undefined;
};

function Row({ onClick, height = "5rem", sx, children }: RowType) {
  const { columns } = useContext(TableContext);
  return (
    <Tr
      display='grid'
      gridTemplateColumns={columns}
      onClick={onClick}
      fontSize='1.6rem'
      height={height}
      _notLast={{ borderBottom: "1px var(--color-primary-300) solid" }}
      alignContent='center'
      alignItems='center'
      sx={sx}
    >
      {children}
    </Tr>
  );
}
Header.Cell = HeaderCell;
Row.Cell = BodyTableCell;
CustomTable.Header = Header;
CustomTable.Row = Row;
CustomTable.Footer = Footer;
CustomTable.Body = Body;
CustomTable.TranslateLabelsHeader = TranslateLabelsHeader;
export default CustomTable;
