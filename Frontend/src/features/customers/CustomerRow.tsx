import { useNavigate } from "react-router-dom";
import Table from "../../components/CustomTable";
import StatusTag from "../../components/StatusTag";
import { CustomerSlimDetailsProps } from "./customers";

function CustomerRow({
  customerID,
  customerShortName,
  address,
  city,
  customerStatus,
}: CustomerSlimDetailsProps) {
  const navigate = useNavigate();

  return (
    <Table.Row
      onClick={() => navigate(`${customerID}`)}
      height='5rem'
      sx={{ cursor: "pointer" }}
    >
      <Table.Row.Cell>{customerID} </Table.Row.Cell>
      <Table.Row.Cell>{customerShortName} </Table.Row.Cell>
      <Table.Row.Cell>{address}</Table.Row.Cell>
      <Table.Row.Cell>{city}</Table.Row.Cell>
      <Table.Row.Cell>
        <StatusTag status={customerStatus || "none"} />
      </Table.Row.Cell>
    </Table.Row>
  );
}
export default CustomerRow;
