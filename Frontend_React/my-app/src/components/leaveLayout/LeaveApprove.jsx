import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

function ApproveLeaveTable() {
  const [data, setData] = useState([{ id: "numa", name: "jdsh", status: "io" }]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/getLeaveDataByManager", {
        id: 1, // Change by current user
      })
      .then((response) => {
        console.log("manager leave", response.data);
        setData(response.data);
      });
  }, []);

  const handleAccept = (index) => {
    const updatedData = [...data];
    updatedData[index].status = 2;
    setData(updatedData);
    axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id: data[index].leave_id,
      status: 2,
    });
  };

  const handleReject = (index) => {
    const updatedData = [...data];
    updatedData[index].status = 3;
    setData(updatedData);
    axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id: data[index].leave_id,
      status: 3,
    });
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Leave Approval List</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.leave_id}</TableCell>
                <TableCell>{row.employee_id}</TableCell>
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
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAccept(index)}
                    disabled={row.status !== 1}
                    style={{ marginRight: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(index)}
                    disabled={row.status !== 1}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ApproveLeaveTable;
