import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";  // Updated import
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import localization provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  // Adapter for Dayjs
import axios from "axios";
import DonutChartCard from "./timesheetAcceptedVsRejected";
import LineChart from "./LineChart";
import PieChartCard from "./ProjectsPiechartBasedOnhrs";
import BarChartByRole from "./HoursWorkedPerDayByRole";
import dayjs from "dayjs";

const DashboardPage = () => {
  // Default dates: First and last day of the current month
  const currentMonthStart = dayjs().startOf("month");
  const currentMonthEnd = dayjs().endOf("month");

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);

  const [acceptedQuantity, setAcceptedQuantity] = useState(80);
  const [rejectedQuantity, setRejectedQuantity] = useState(20);
  const [workData, setWorkData] = useState({
    "2024-10-01": 6,
    "2024-10-02": 8,
    "2024-10-03": 7,
    "2024-10-04": 5,
    "2024-10-05": 9,
    "2024-10-06": 8,
  });
  const [projectData, setProjectData] = useState({
    "Project A": 1,
    "Project B": 2,
    "Project C": 8,
    "Project D": 12,
  });
  const [roleData, setRoleData] = useState({
    "2024-10-01": {
      Developer: 6,
      Manager: 3,
    },
    "2024-10-02": {
      Developer: 8,
      Manager: 5,
      Tester: 7,
    },
    "2024-10-03": {
      Developer: 5,
      Tester: 6,
    },
  });

  const fetchData = async (start, end) => {
    try {
      const response = await axios.get("/api/timesheetData", {
        params: {
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
        },
      });
      const { accepted, rejected, work, projects, roles } = response.data;
      setAcceptedQuantity(accepted);
      setRejectedQuantity(rejected);
      setWorkData(work);
      setProjectData(projects);
      setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

//   useEffect(() => {
//     fetchData(startDate, endDate);
//   }, [startDate, endDate]);

  const Navbar = () => (
    <AppBar position="static" sx={{ backgroundColor: "#008000" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
            renderInput={(params) => <TextField {...params} sx={{ input: { color: "#fff" } }} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
            renderInput={(params) => <TextField {...params} sx={{ input: { color: "#fff" } }} />}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchData(startDate, endDate)}
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
      {/* <h1>Donut Chart Example</h1> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "50px",
        }}
      >
        <DonutChartCard accepted={acceptedQuantity} rejected={rejectedQuantity} />
        <DonutChartCard accepted={acceptedQuantity} rejected={rejectedQuantity} />
        <PieChartCard data={projectData} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ padding: "20px" }}>
          <LineChart data={workData} />
        </div>

        <div style={{ padding: "20px" }}>
          <BarChartByRole data={roleData} />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DashboardPage;
