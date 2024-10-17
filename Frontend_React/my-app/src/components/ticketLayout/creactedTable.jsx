import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import "../App.css";
import axios from "axios";

function upperEditableTable({ data }) {
  return (
    <Container>
      <div className="keep-space-bet-components">
        <h3 style={{ marginTop: "40px" }}>Tickets List</h3>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Raised For</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ticket_id}</TableCell>
                <TableCell>{row.create_at}</TableCell>
                <TableCell>{row.ref_employee_id}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.project_id}</TableCell>
                <TableCell>{row.status ? "Complete" : "Pending"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default upperEditableTable;
