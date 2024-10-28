import React from "react";
import { Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../App.css";

function UpperEditableTable({ data }) {
  const columns = [
    { field: "ticket_id", headerName: "Ticket ID", width: 150 },
    { field: "create_at", headerName: "Created At", width: 200 },
    { field: "ref_employee_id", headerName: "Raised For", width: 170 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "project_id", headerName: "Project ID", width: 170 },
    { field: "status", headerName: "Status", width: 150, renderCell: (params) => (params.value ? "Closed" : "Open") },
  ];

  return (
    <Container>
      <div className="keep-space-bet-components">
        <h3 style={{ marginTop: "40px" }}>Tickets List</h3>
      </div>

      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.ticket_id}
        />
      </div>
    </Container>
  );
}

export default UpperEditableTable;
