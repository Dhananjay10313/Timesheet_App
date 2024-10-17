import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Updated import
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Import localization provider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adapter for Dayjs
import axios from "axios";
import DonutChartCard from "./timesheetAcceptedVsRejected";
import DonutChartCar2 from "./companyHrsVSteamHrs";
import LineChart from "./LineChart";
import PieChartCard from "./ProjectsPiechartBasedOnhrs";
import BarChartByRole from "./HoursWorkedPerDayByRole";
import dayjs from "dayjs";
import { useAuth } from "../provider/authProvider";

const DashboardPage = () => {
  // Default dates: First and last day of the current month
  
  const currentMonthStart = dayjs().startOf("month");
  const currentMonthEnd = dayjs().endOf("month");

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);

  const [acceptedQuantity, setAcceptedQuantity] = useState(80);
  const [rejectedQuantity, setRejectedQuantity] = useState(10);
  const [receivedQuantity, setReceivedQuantity] = useState(80);

  const [companyHrs,setCompanyHrs] = useState(80)
  const [teamHrs,setTeamHrs] = useState(20)
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

  const { token, userState } = useAuth();
  console.log("kdksksjd", userState)

  const fetchData = async (start, end) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/getTotalCompanyHrsVsTeamsHrs",
        {
          manager_id: 1, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      const { team_worked_hrs, company_worked_hrs } = response.data;
      // console.log("here",response.data)
      setTeamHrs(team_worked_hrs);
      setCompanyHrs(company_worked_hrs);
      // setWorkData(work);
      // setProjectData(projects);
      // setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/calculateHoursProject",
        {
          manager_id: 1, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      const totalProjectWorked = response.data;
      // console.log("here",response.data)
      // setAcceptedQuantity(team_worked_hrs);
      // setRejectedQuantity(company_worked_hrs);
      // setWorkData(work);
      setProjectData(totalProjectWorked);
      // setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/getHrsWorkedPerDay",
        {
          manager_id: 1, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      const projectWorkedPerDay = response.data;
      // console.log("here",response.data)
      // setAcceptedQuantity(team_worked_hrs);
      // setRejectedQuantity(company_worked_hrs);
      setWorkData(projectWorkedPerDay);
      // setProjectData(projectWorked);
      // setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/getApprovedVsRecieved",
        {
          manager_id: 1, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      const { total_received, total_rejected, total_approved } = response.data;
      console.log("received",response.data)
      setAcceptedQuantity(total_approved);
      setRejectedQuantity(total_rejected);
      setReceivedQuantity(total_received)
      // setWorkData(projectWorkedPerDay);
      // setProjectData(projectWorked);
      // setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/getEmployeeTimesheetDataWithRole",
        {
          manager_id: 1, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      const workedPerDayByRole = response.data;
      // console.log("here",response.data)
      // setAcceptedQuantity(team_worked_hrs);
      // setRejectedQuantity(company_worked_hrs);
      // setWorkData(projectWorkedPerDay);
      // setProjectData(projectWorked);
      setRoleData(workedPerDayByRole);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    console.log(
      "Dates",
      typeof startDate.format("YYYY-MM-DD HH:mm:ss"),
      endDate
    );
    fetchData(startDate, endDate);
  }, []);

  //   useEffect(() => {
  //     fetchData(startDate, endDate);
  //   }, [startDate, endDate]);

  const Navbar = () => (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#008000", marginTop: "0px" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
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
        <DonutChartCard
          accepted={acceptedQuantity}
          rejected={rejectedQuantity}
          received={receivedQuantity}
        />
        <DonutChartCar2
          accepted={companyHrs}
          rejected={teamHrs}
        />
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
