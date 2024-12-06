import { useSearchParams } from "react-router-dom";

export function usePeriodExpirationParams() {
  const [searchParams] = useSearchParams();
  const daysBeforeExpiration =
    Number(searchParams.get("daysBeforeExpiration")) || 21;
  const monthsAfterExpiration =
    Number(searchParams.get("monthsAfterExpiration")) || 4;

  return { daysBeforeExpiration, monthsAfterExpiration };
}
