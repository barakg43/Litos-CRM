import { useNavigate } from "react-router-dom";
import CustomTable from "./CustomTable";

function CustomerNameCell({
  customerID,
  customerName,
}: {
  customerID: number | null;
  customerName: string | undefined;
}) {
  const navigate = useNavigate();
  const isCustomerSelected = customerID !== null;
  return (
    <CustomTable.Row.Cell
      onClick={
        isCustomerSelected
          ? () => navigate(`/customers/${customerID}`)
          : undefined
      }
      sx={{
        cursor: isCustomerSelected ? "pointer" : "not-allowed",
        _hover: { color: "teal.500", textDecoration: "underline" },
      }}
    >
      {customerName}
    </CustomTable.Row.Cell>
  );
}

export default CustomerNameCell;
