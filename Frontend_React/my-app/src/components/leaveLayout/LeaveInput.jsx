import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LeaveEditableTable from "./LeaveApply";
import axios from "axios";
import ApproveLeaveTable from "./LeaveApprove";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "react-bootstrap";

async function fetchLeaveData(emp_id) {
  try {
    const response = await axios.post(
      "http://localhost:8000/getLeaveDataByUser",
      { emp_id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leave data:", error);
    return [];
  }
}

async function fetchLeaveRemainingData(emp_id) {
  try {
    const response = await axios.post(
      "http://localhost:8000/getLeavesRemaining",
      { emp_id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leave remaining data:", error);
    return [];
  }
}

function LeaveInputBox() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [balanceData, setBalanceData] = useState([]);
  const [data, setData] = useState([]);

  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    const fetchData = async () => {
      const leaveResponse = await fetchLeaveData(employee_id);
      setData(leaveResponse);

      const remainingResponse = await fetchLeaveRemainingData(employee_id);
      setBalanceData(remainingResponse);
    };

    fetchData();
  }, []);

  useEffect(() => {
    //console.log("balance Data", balanceData);
  }, [balanceData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const leave_id = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate?.format("YYYY-MM-DD");
    //console.log("Date formatted", formattedEndDate)

    const daysRequested =
      Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    const selectedData = balanceData.find(
      (item) => item.t_id == selectedOption
    );

    if (selectedData?.balance < daysRequested) {
      toast.error("Not enough holidays of this type available");
    } else {
      await axios.post("http://localhost:8000/addLeaveDataToTable", {
        leave_id: leave_id,
        start_time: formattedStartDate,
        end_time: formattedEndDate,
        reason,
        t_id: parseInt(selectedOption),
        status: 1,
        manager_id: manager_id,
        employee_id: employee_id,
      });

      await axios.post("http://localhost:8000/addAlert", {
        employee_id: manager_id,
        alt_type: 2,
        alt_description: `Leave Request raised by employee ${employee_id} `,
        status: 0,
      });

      console.log("KK", parseInt(selectedOption));

      setData([
        ...data,
        {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          reason,
          type: parseInt(selectedOption),
          status: 1,
          leave_id: leave_id,
        },
      ]);

      // Reset the input fields
      setStartDate(dayjs());
      setEndDate(null);
      setReason("");
      setSelectedOption("");
    }
  };

  const columns = [
    { field: "t_id", headerName: "ID", width: 250 },
    { field: "name", headerName: "Type", width: 500 },
    { field: "balance", headerName: "Leaves Left", width: 250 },
    { field: "t_days", headerName: "Total Leaves", width: 250 },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h2>Apply for Leave</h2>

        <TextField
          label="Reason for Leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          margin="normal"
        />

        <div style={{ display: "flex", gap: "20px", marginBottom: "1px" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            minDate={dayjs()}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            minDate={startDate || dayjs()}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </div>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Leave Type</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="1">Sick Leave</MenuItem>
            <MenuItem value="2">Casual Leave</MenuItem>
            <MenuItem value="3">Paid Leave</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      <Container style={{ height: "auto", width: "auto", marginTop: "40px" }}>
        <h3>Your Leave Balance</h3>
        <DataGrid
          rows={balanceData}
          columns={columns}
          getRowId={(row) => row.t_id}
        />
      </Container>

      <LeaveEditableTable data={data} />

      {/* <ApproveLeaveTable /> */}
    </LocalizationProvider>
  );
}

export default LeaveInputBox;
