import { As, Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import { isRtlLang } from "../i18n/i18n";
import { ITEMS_AMOUNT_PER_PAGE } from "../services/globalTypes";
import { getPagesAmount } from "../services/utils";

function Pagination({
  totalItemsAmount = 0,
  itemsPerPage = ITEMS_AMOUNT_PER_PAGE,
  as = "td",
}: {
  totalItemsAmount: number;
  itemsPerPage?: number;
  as?: As | undefined;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("components", { keyPrefix: "pagination" });

  const currentPage = Number(searchParams.get("page")) || 1;
  const pagesCount = getPagesAmount(totalItemsAmount, itemsPerPage);
  if (pagesCount <= 1) return null;
  const isRTL = isRtlLang();
  const updatePageQuery = (pageNumber: number) => {
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };

  function nextPage() {
    if (currentPage < pagesCount) {
      updatePageQuery(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      updatePageQuery(currentPage - 1);
    }
  }
  const currentFrom = (currentPage - 1) * itemsPerPage + 1;
  const currentTo =
    currentPage < pagesCount ? currentPage * itemsPerPage : totalItemsAmount;
  return (
    <Flex alignItems='center' justifyContent='space-around' as={as}>
      <PaginationButton onClick={previousPage} disabled={currentPage === 1}>
        {isRTL ? <TbChevronsRight /> : <TbChevronsLeft />}
        {t("button.previous")}
      </PaginationButton>

      <Text
        sx={{
          span: {
            fontWeight: "bold",
          },
        }}
      >
        {t("summary.showing")} <span>{currentFrom}</span> {t("summary.to")}
        <span> {currentTo}</span> {t("summary.of")}
        <span> {totalItemsAmount}</span> {t("summary.results")}
      </Text>
      <PaginationButton
        onClick={nextPage}
        disabled={currentPage === pagesCount}
      >
        {t("button.next")} {isRTL ? <TbChevronsLeft /> : <TbChevronsRight />}
      </PaginationButton>
    </Flex>
  );
}

function PaginationButton({
  children,
  onClick,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean | undefined;
  props?: ButtonProps;
}) {
  return (
    <Button
      onClick={onClick}
      isDisabled={disabled}
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      padding='var(--scale-00)'
      borderRadius='3xl'
      background='transparent'
      border='none'
      color='var(--color-brand-400)'
      _focus={{ outline: "none" }}
      _disabled={{ color: "var(--color-brand-200)" }}
      sx={{
        "&:not(:disabled):hover": {
          backgroundColor: "var(--color-primary-300)",
          color: " var(--color-brand-800)",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
export default Pagination;
