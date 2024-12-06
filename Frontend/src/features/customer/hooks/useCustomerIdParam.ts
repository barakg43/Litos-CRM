import { useParams } from "react-router-dom";

export function useCustomerIdParam() {
  const { customerId } = useParams();
  return Number(customerId);
}
