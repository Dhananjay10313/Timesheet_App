import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

function LeaveEditableTable({ data }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Your Leave Requests</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.leave_id}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  {row.t_id === 1
                    ? "Sick Leave"
                    : row.t_id === 2
                    ? "Casual Leave"
                    : "Paid Leave"}
                </TableCell>
                <TableCell>
                  {row.status === 1
                    ? "Pending"
                    : row.status === 2
                    ? "Approved"
                    : "Rejected"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default LeaveEditableTable;
