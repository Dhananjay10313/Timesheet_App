

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "react-bootstrap";

function LeaveEditableTable({ data }) {
  const columns = [
    { field: "leave_id", headerName: "Leave ID", width: 230 },
    { field: "start_date", headerName: "Start Date", width: 200 },
    { field: "end_date", headerName: "End Date", width: 200 },
    { field: "reason", headerName: "Reason", width: 250 },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      renderCell: (params) =>
        params.row.type == 1
          ? "Sick Leave"
          : params.row.type == 2
          ? "Casual Leave"
          : "Paid Leave",
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) =>
        params.row.status === 1
          ? "Pending"
          : params.row.status === 2
          ? "Approved"
          : "Rejected",
    },
  ];

  return (
    <Container style={{ height: "auto", width: "auto", marginTop: "40px" }}>
      <h3>Your Leave Requests</h3>
      <DataGrid rows={data} columns={columns} getRowId={(row) => row.leave_id} />
    </Container>
  );
}

export default LeaveEditableTable;
