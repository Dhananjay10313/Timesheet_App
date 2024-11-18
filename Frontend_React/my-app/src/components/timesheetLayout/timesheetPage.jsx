import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap"; // Remove Table import from here
import axios from "axios";
import Timesheet from "./timesheet";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";

async function fetchTimesheetData(emp_id) {
  try {
    const response = await axios.post(
      "http://localhost:8000/getTimesheetDataByUser",
      {
        emp_id: emp_id,
      },
      {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        }
    }
    );
    //console.log("fetch data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    return [];
  }
}

function TimesheetTablePage() {
  const [timesheetData, setTimesheetData] = useState([
    {
      id: 7,
      employee_id: 1,
      end: "2024-10-06T11:15:44",
      manager_id: null,
      project: 1,
      start: "2024-10-06T11:15:44",
      status: 1,
      text: "string",
    },
  ]);
  const [data, setData] = useState([
    { id: "numa", name: "jdsh", status: "io" },
  ]);

  const [formattedData, setFormattedData] = useState([]);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [appId, setAppId] = useState(12);

  const [tmStatus, setTmStatus] = useState(false);
  const [ind, setInd] = useState(0);
  const [projects, setProjects] = useState([]);
  const [modProjects, setModProjects] = useState([
    { id: 1, name: "Project A", color: "#38761d" },
    { id: 2, name: "Project B", color: "#0d8ecf" },
    { id: 3, name: "Project C", color: "#f1c232" },
  ]);
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];
  const [latestDate, setLatestDate] = useState(null);
  const bnStatus = JSON.parse(localStorage.getItem("bnStatus"));
  // let project_id1=0
  const [project_id1, setProject_id1] = useState(0);

  const [isDisabledB, setIsDisabledB] = useState(bnStatus ? true : false);

  const [refEmp, setRefEmp] = useState(employee_id);

  useEffect(() => {
    // useEffect(()=>{
    const bnStatus = JSON.parse(localStorage.getItem("bnStatus"));
    //console.log("kl: ", typeof isDisabledB);
    // },[])
    const fetchData = async () => {
      const timesheetResponse = await fetchTimesheetData(refEmp);
      setTimesheetData(timesheetResponse);

      const formattedDataList = timesheetResponse.map((item) => ({
        id: item.id,
        text: item.text,
        start: item.start,
        end: item.end,
        project: item.project,
      }));
      setFormattedData(formattedDataList);

      try {
        const approvalResponse = await axios.post(
          "http://localhost:8000/getTimesheetApprovalRequestByManager",
          {
            manager_id: manager_id,
          },
          
        );
        setData(approvalResponse.data);
      } catch (error) {
        // console.error("Error fetching approval data:", error);
      }

      try {
        const projectResponse = await axios.post(
          "http://localhost:8000/getProjectDataByuser",
          {
            emp_id: employee_id,
          }
        );
        setProjects(projectResponse.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }

      const response = await axios.post(
        "http://localhost:8000/getLatestApproveRequestForEmployee",
        { emp_id: 1 }
      );
      setLatestDate(response.data["latest_date"]);
    };

    fetchData();
  }, [refEmp]);

  useEffect(() => {
    const generateProjectDetails = (id, name) => {
      return {
        id: id,
        name: name,
        color: "#38761d",
      };
    };

    const modProjects1 = projects.map((fp) =>
      generateProjectDetails(fp.project_id, fp.name)
    );
    //console.log("projects", projects);
    setModProjects(modProjects1);
    // project_id1=projects[0].id
    if (projects.length > 0) setProject_id1(projects[0].project_id);
  }, [timesheetData, projects]);

  const handleAccept = async () => {
    const tempArr = [...data];
    tempArr[ind].status = 2;
    setData(tempArr);
    setTmStatus(true);

    await axios.post("http://localhost:8000/postTimesheetApproveReq", {
      ap_id: appId,
    });
  };

  const handleReject = async () => {
    const tempArr = [...data];
    tempArr[ind].status = 3;
    setData(tempArr);
    setTmStatus(true);

    await axios.post("http://localhost:8000/postTimesheetRejectReq", {
      ap_id: appId,
    });

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: refEmp,
      alt_type: 1,
      alt_description: "Timesheet Rejected",
      status: 0,
    });
  };

  const handleSend = async () => {
    setIsDisabledB(true);
    localStorage.setItem("bnStatus", true);
    await axios.post("http://localhost:8000/addTimesheetForApproval", {
      employee_id: employee_id,
      manager_id: manager_id,
    });

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: manager_id,
      alt_type: 1,
      alt_description: `Timesheet approval request raised by employee id${employee_id}`,
      status: 0,
    });

    toast.success("Request sent");
  };

  const handleDelete = async () => {
    setIsDisabledB(true);
    localStorage.setItem("bnStatus", true);
    // setTimesheetData([]);
    await axios.delete("http://localhost:8000/deleteTimesheetData", {
      data: { emp_id: employee_id },
    });

    toast.success("Deletion complete");

    const timesheetResponse = await fetchTimesheetData(refEmp);
    setTimesheetData(timesheetResponse);
  };

  useEffect(() => {
    localStorage.setItem("bnStatus", isDisabledB);
  }, [isDisabledB]);

  const handleRowClick = async (index) => {
    const employeeId = data[index].employee_id;
    setRefEmp(employeeId);
    setAppId(data[index].ap_id);
    setTmStatus(data[index].status == 1 ? false : true);
    setInd(index);

    const timesheetResponse = await fetchTimesheetData(employeeId);
    setTimesheetData(timesheetResponse);

    const formattedDataList = timesheetResponse.map((item) => ({
      id: item.id,
      text: item.text,
      start: item.start,
      end: item.end,
      project: item.project,
    }));
    setFormattedData(formattedDataList);
  };

  //console.log("modProjectshere", modProjects);
  //console.log("evenst", timesheetData);

  return (
    <>
      <ToastContainer />
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#e6e6e6", marginBottom: "50px" }}
      >
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: "black" }}>
            Timesheet Management {": Employee id " + refEmp}
          </Typography>

          {false ? ( // For Manager View
            <>
              <Button
                variant="contained"
                color="success"
                disabled={tmStatus}
                onClick={handleAccept}
                style={{ marginRight: "10px" }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={tmStatus}
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          ) : (
            // For Employee View
            <>
              <Button
                variant="contained"
                color="success"
                disabled={false}
                onClick={handleSend}
                style={{ marginRight: "10px" }}
              >
                Submit for Approval
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={false}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        {/* Timesheet Component */}
        <Timesheet
          events={timesheetData}
          employee_id={refEmp}
          modProjects={modProjects}
          setIsDisabledB1={setIsDisabledB}
          project_id1={project_id1}
        />

        {/* Space between Timesheet and Table */}
        {/* <Box mb={3} /> Add margin bottom to create space */}
        {/* 
      <Typography variant="h4" style={{ marginTop: "60px", marginBottom: "10px" }}>
        Timesheets for Approval
      </Typography> */}

        {/* Approval Request Table
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Approval Id</TableCell>
              <TableCell>Employee Id</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} onClick={() => handleRowClick(index)}>
                <TableCell>{row.ap_id}</TableCell>
                <TableCell>{row.employee_id}</TableCell>
                <TableCell>{row.created_at}</TableCell>
                <TableCell>
                  {row.status === 1
                    ? "Pending"
                    : row.status === 2
                    ? "Accepted"
                    : "Rejected"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      </Container>
    </>
  );
}

export default TimesheetTablePage;
