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

async function fetchLeaveData(emp_id) {
  try {
    const response = await axios.post("http://localhost:8000/getLeaveDataByUser", { emp_id });
    return response.data;
  } catch (error) {
    console.error("Error fetching leave data:", error);
    return [];
  }
}

async function fetchLeaveRemainingData(emp_id) {
  try {
    const response = await axios.post("http://localhost:8000/getLeavesRemaining", { emp_id });
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
  
  useEffect(() => {
    const fetchData = async () => {
      const leaveResponse = await fetchLeaveData(1); // Fetch for employee ID 1 (you can replace with dynamic value)
      setData(leaveResponse);

      const remainingResponse = await fetchLeaveRemainingData(1);
      setBalanceData(remainingResponse);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate?.toISOString().slice(0, 10);

    const daysRequested = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    const selectedData = balanceData.find((item) => item.t_id === selectedOption);

    if (selectedData?.balance < daysRequested) {
      toast.error("Specified holidays not available");
    } else {
      // Post the leave application and update remaining leaves
      await axios.post("http://localhost:8000/addLeaveDataToTable", {
        start_time: formattedStartDate,
        end_time: formattedEndDate,
        reason,
        t_id: parseInt(selectedOption),
        status: 1,
        manager_id: 1,
        employee_id: 1,
      });

      await axios.post("http://localhost:8000/updateRemainingLeaves", {
        emp_id: 1, // Adjust based on current user
        t_id: parseInt(selectedOption),
        days: daysRequested,
      });

      setData([...data, { start_time: formattedStartDate, end_time: formattedEndDate, reason }]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h2>Apply for Leave</h2>

        {/* Reason Input */}
        <TextField
          label="Reason for Leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Date Pickers for Leave Start and End Date */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "1px" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            minDate={dayjs()} // Ensure the start date cannot be before today
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            minDate={startDate || dayjs()} // Ensure the end date cannot be before the start date
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </div>

        {/* Leave Type Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Leave Type</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="1">Sick Leave</MenuItem>
            <MenuItem value="2">Casual Leave</MenuItem>
            <MenuItem value="3">Paid Leave</MenuItem>
            {/* Add more leave types as needed */}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Leave Application
        </Button>
      </div>

      {/* Display Leave Data */}
      <LeaveEditableTable data={data} />
      <ApproveLeaveTable />
    </LocalizationProvider>
  );
}

export default LeaveInputBox;
