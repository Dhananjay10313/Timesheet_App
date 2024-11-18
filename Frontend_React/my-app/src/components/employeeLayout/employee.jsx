import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from '@mui/x-data-grid';


const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const currentMonthStart = dayjs().month(9).startOf("month");
  const currentMonthEnd = dayjs().endOf("month");

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"]
  

  const columns = [
    { field: "employee_id", headerName: "Employee ID", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "HoursWorked", headerName: "Total Hrs Logged", width: 180 },
    { field: 'leaves', headerName: 'Leaves Taken', width: 180 },
    { field: 'projects', headerName: 'Projects', width: 200 },
    
  ];

  const rows = employees.map((employee, index) => ({
    id: index,
    employee_id: employee.employee_id,
    name: employee.name,
    role: employee.role,
    HoursWorked: employee.LoggedHrs,
    projects: employee.projects,
    leaves: employee.LeaveDays
  }));

  const fetchEmployees = async (start,end) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/getEmployeeInfo",
        {
          "emp_id": 0,
          "manager_id": employee_id,
          "ap_id": 0,
          "start_time": start.format("YYYY-MM-DD HH:mm:ss"),
          "end_time": end.format("YYYY-MM-DD HH:mm:ss"),
          "password": "string"
        }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(startDate,endDate);
  }, []);

  const Navbar = () => (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        mb: "30px",
        boxShadow: "none",
        border: "none",
        mt: "5px",
      }}
    >
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1, color: "black" }}>
          Employee Information
        </Typography>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} sx={{ input: { color: "#fff" } }} />
            )}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} sx={{ input: { color: "#fff" } }} />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchEmployees(startDate, endDate)}
          >
            Apply
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Navbar />
      <Container>
        <Paper style={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default EmployeeTable;
