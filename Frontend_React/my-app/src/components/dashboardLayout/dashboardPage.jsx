import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import DonutChartCard from "./timesheetAcceptedVsRejected";
import DonutChartCar2 from "./companyHrsVSteamHrs";
import LineChart from "./LineChart";
import PieChartCard from "./ProjectsPiechartBasedOnhrs";
import BarChartByRole from "./HoursWorkedPerDayByRole";
import dayjs from "dayjs";
import { useAuth } from "../provider/authProvider";

const DashboardPage = () => {
  const currentMonthStart = dayjs().month(9).startOf("month");
  const currentMonthEnd = dayjs().endOf("month");

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);

  const [acceptedQuantity, setAcceptedQuantity] = useState(80);
  const [rejectedQuantity, setRejectedQuantity] = useState(10);
  const [receivedQuantity, setReceivedQuantity] = useState(80);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);

  const [companyHrs, setCompanyHrs] = useState(80);
  const [teamHrs, setTeamHrs] = useState(20);
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

  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];
  const [pendingTickets, setPendingTickets] = useState(0);

  // const { token, userState } = useAuth();
  //console.log("kdksksjd", userState);

  const fetchData = async (start, end) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/getTotalCompanyHrsVsTeamsHrs",
        {
          manager_id: employee_id,
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
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
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
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
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
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
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { total_received, total_rejected, total_approved } = response.data;
      //console.log("received", response.data);
      setAcceptedQuantity(total_approved);
      setRejectedQuantity(total_rejected);
      setReceivedQuantity(total_received);
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
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
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
    try {
      const response = await axios.post(
        "http://localhost:8000/getLeaveData",
        {
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD"),
          end_time: end.format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const totL = response.data;
      setTotalLeaves(totL.leave_records);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/getTopPerformers",
        {
          manager_id: employee_id, // change with currently logged manager
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const topPerformance = response.data;
      // console.log("here",response.data)
      // setAcceptedQuantity(team_worked_hrs);
      // setRejectedQuantity(company_worked_hrs);
      // setWorkData(projectWorkedPerDay);
      // setProjectData(projectWorked);
      setTopPerformers(topPerformance);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/getPendingTickets",
        {
          emp_id: employee_id,
          start_time: start.format("YYYY-MM-DD HH:mm:ss"),
          end_time: end.format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const cnt = response.data;
      // console.log("here",response.data)
      setPendingTickets(cnt);
      // setWorkData(work);
      // setProjectData(projects);
      // setRoleData(roles);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    // console.log(
    //   "Dates",
    //   typeof startDate.format("YYYY-MM-DD HH:mm:ss"),
    //   endDate
    // );
    fetchData(startDate, endDate);
  }, []);

  //   useEffect(() => {
  //     fetchData(startDate, endDate);
  //   }, [startDate, endDate]);

  const Navbar = () => (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#ffffff", marginTop: "0px" }}
    >
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1, color: "black" }}>
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
            minDate={startDate}
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
      <div style={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            padding: 2,
            marginTop: 1,
            marginLeft: 1,
          }}
        >
          <Card sx={{ width: 300, height: 140 }}>
            <CardContent>
              <Typography variant="h5" align="left" sx={{ fontSize: "1.5rem" }}>
                Team Total Days Off
              </Typography>
              <Typography
                variant="h3"
                align="left"
                sx={{ fontWeight: "bold", fontSize: "3.8rem" }}
              >
                {totalLeaves}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 300, height: 140 }}>
            <CardContent>
              <Typography variant="h5" align="left" sx={{ fontSize: "1.2rem" }}>
                Total Team Working Hours
              </Typography>
              <Typography
                variant="h3"
                align="left"
                sx={{ fontWeight: "bold", fontSize: "3.8rem" }}
              >
                {teamHrs}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 300, height: 130 }}>
            <CardContent>
              <Typography variant="h5" align="left" sx={{ fontSize: "1.2rem" }}>
                Your Pending Tickets
              </Typography>
              <Typography
                variant="h3"
                align="left"
                sx={{ fontWeight: "bold", fontSize: "3.8rem" }}
              >
                {pendingTickets}
              </Typography>
            </CardContent>
          </Card>

          <TableContainer
            component={Paper}
            sx={{
              width: 300,
              height: 230,
              overflow: "hidden",
              "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for WebKit browsers
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1.25rem" }}>
                    Top Performers
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.25rem" }}>
                    Hours
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPerformers.map((performer, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "1.25rem" }}
                    >
                      {performer.employee_name}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "1.25rem" }}>
                      {performer.total_hours}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Container sx={{ marginRight: 30, marginTop: 1.5, width: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            <DonutChartCard
              accepted={acceptedQuantity}
              rejected={rejectedQuantity}
              received={receivedQuantity}
            />
            <DonutChartCar2 companyHours={companyHrs} teamHours={teamHrs} />
            <PieChartCard data={projectData} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            {/* <div style={{ padding: "20px" }}>
            
          </div> */}
            <div style={{ margin: "10px" }}>
              <LineChart data={workData} />
            </div>

            {/* <div style={{ padding: "20px" }}> */}
            <div style={{ margin: "10px" }}>
              <BarChartByRole data={roleData} />
            </div>
          </div>
        </Container>
      </div>
    </LocalizationProvider>
  );
};

export default DashboardPage;
