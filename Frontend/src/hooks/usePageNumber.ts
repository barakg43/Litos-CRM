import { useSearchParams } from "react-router-dom";

export function usePageNumber() {
  const [searchParams] = useSearchParams();
  return Number(searchParams.get("page")) || 1;
}
