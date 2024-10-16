import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "axios";

function EditableTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/getTicketDataByRefUser", {
        id: 1,
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      });
  }, []);

  const handleCheckboxChange = (index, status) => {
    const updatedData = [...data];

    if (!data[index].status && status && data[index].status !== null) {
      updatedData[index].status = status;
      setData(updatedData);
      axios.post("http://localhost:8000/updateTicketDataToDone", {
        id: data[index].ticket_id,
      });
    }

    // Display information about the row
    console.log(
      `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
    );
  };

  return (
    <Container>
      <h3 style={{ marginTop: "40px" }}>For You</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ticket_id}</TableCell>
                <TableCell>{row.creator_id}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.project_id}</TableCell>
                <TableCell>{row.create_at}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={row.status}
                    onChange={(e) =>
                      handleCheckboxChange(index, e.target.checked)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default EditableTable;
