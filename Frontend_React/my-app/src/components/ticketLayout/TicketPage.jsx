import MyForm from "./TicketInpBox";
import EditableTable from "./RefTable";
import BasicExample from "./creactedTable";

function TicketPage() {
  return (
    <div className="container ticket-container">
      <MyForm />
      <EditableTable />
    </div>
  );
}

export default TicketPage;
