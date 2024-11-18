
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
  TableFooter,
  Paper,
  TablePagination,
  TextField,
  Grid,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
// import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, \ } from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

async function fetchTimesheetData(emp_id) {
  try {
    const response = await axios.post(
      "http://localhost:8000/getTimesheetDataByUser",
      {
        emp_id: emp_id,
      }
    );
    //console.log("fetch data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    return [];
  }
}

function ApprovalTimesheetTablePage() {
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
  const [isDisabledB, setIsDisabledB] = useState(false);
  const [tmStatus, setTmStatus] = useState(false);
  const [ind, setInd] = useState(0);
  const [projects, setProjects] = useState([]);
  const [modProjects, setModProjects] = useState([]);
  const [showData, setShowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];
  const [refEmp, setRefEmp] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([]);

  const [dropdownValue, setDropdownValue] = useState(0);

  useEffect(() => {
    const generateOptions = (dataLength) => {
      const options = [];
      for (let i = 5; i < dataLength && options.length < 3; i *= 2) {
        options.push(i);
      }
      if (!options.includes(dataLength)) {
        options.push(dataLength);
      }
      return options;
    };

    setRowsPerPageOptions(generateOptions(showData.length));
  }, [showData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
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
            manager_id: employee_id, //change with currently logged in user
          }
        );
        setData(approvalResponse.data);
        //console.log("Dtata", approvalResponse.data);
        setShowData(approvalResponse.data);
      } catch (error) {
        console.error("Error fetching approval data:", error);
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
    };

    fetchData();
  }, []);

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
    // if(projects.length>0) setProject_id1(projects[0].project_id)
  }, [timesheetData, projects]);

  const handleAccept = async () => {
    const tempArr = [...data];
    tempArr[ind].status = 2;
    setData(tempArr);
    setTmStatus(true);

    await axios.post("http://localhost:8000/postTimesheetApproveReq", {
      ap_id: appId,
    });

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: refEmp,
      alt_type: 4,
      alt_description: "Timesheet Accepted",
      status: 0,
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
    await axios.post("http://localhost:8000/addTimesheetForApproval", {
      employee_id: employee_id,
      manager_id: manager_id,
    });
  };

  const handleDelete = async () => {
    setIsDisabledB(true);
    setTimesheetData([]);
    await axios.delete("http://localhost:8000/deleteTimesheetData", {
      data: { emp_id: 1 },
    });
  };

  const handleSearch = () => {
    // console.log("show data", data[0].employee_id.toString().includes(searchQuery))
    const filteredData = data.filter(
      (row) =>
        (row.employee_id.toString() == searchQuery &&
          (dropdownValue == 0 || row.status == dropdownValue)) ||
        (row.name.toLowerCase() == searchQuery.toLowerCase() &&
          (dropdownValue == 0 || row.status == dropdownValue))
      // (row.status === 1
      //   ? "Pending"
      //   : row.status === 2
      //   ? "Accepted"
      //   : "Rejected"
      // ).includes(searchQuery)
    );
    setShowData(filteredData);
    setSearchQuery("");
  };

  // const handleDropdownChange = (event) => {

  // };

  useEffect(() => {
    //console.log("dropdownValue", dropdownValue);
    const filteredData = data.filter(
      (row) => dropdownValue == 0 || row.status == dropdownValue || false
      // (row.status === 1
      //   ? "Pending"
      //   : row.status === 2
      //   ? "Accepted"
      //   : "Rejected"
      // ).includes(searchQuery)
    );
    setShowData(filteredData);
  }, [dropdownValue]);

  const handleShowAll = () => {
    setShowData(data);
    setSearchQuery("");
    setDropdownValue(0);
  };

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

  return (
    <div style={{ margin: "20px" }}>
      {/* <AppBar
            position="static"
            sx={{ backgroundColor: "#e6e6e6", marginBottom: "0px" }}
          >
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1, color: "black" }}>
                Timesheet Management {": Employee id " + refEmp}
              </Typography>

              {refEmp !== 1 ? ( // For Manager View
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
                    disabled={isDisabledB}
                    onClick={handleSend}
                    style={{ marginRight: "10px" }}
                  >
                    Send
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={isDisabledB}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar> */}

      <Typography
        variant="h4"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Timesheets for Approval
      </Typography>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          {/* Space between Timesheet and Table */}
          <Box mb={3} /> {/* Add margin bottom to create space */}
          {/* Approval Request Table */}
          <Box mb={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Select
                  value={dropdownValue}
                  onChange={(e) => {
                    setDropdownValue(e.target.value);
                    handleDropdownChange(e);
                  }}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="" disabled>
                    Select an option
                  </MenuItem>
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={1}>Pending</MenuItem>
                  <MenuItem value={2}>Accepted</MenuItem>
                  <MenuItem value={3}>Rejected</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="flex-start"
              style={{ marginTop: "10px" }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleShowAll}
                >
                  Show All
                </Button>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 420,
              overflowY: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none" /* IE and Edge */,
              "scrollbar-width": "none" /* Firefox */,
              borderLeft: "1px solid rgba(0, 0, 0, 0.1)", // Border on the left
              borderRight: "1px solid rgba(0, 0, 0, 0.1)", // Border on the right
              borderTop: "1px solid rgba(0, 0, 0, 0.1)", // Border on the bottom
              borderBottom: "0px", // Border around the container
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Employee Id</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(row.id)}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.created_at}</TableCell>
                      <TableCell>
                        <IconButton
                          color="success"
                          onClick={() => handleAccept(index)}
                          disabled={row.status !== 1}
                          sx={{ marginRight: "10px" }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleReject(index)}
                          disabled={row.status !== 1}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    padding: 0,
                    borderLeft: "1px solid rgba(0, 0, 0, 0.1)", // Border on the left
                    borderRight: "1px solid rgba(0, 0, 0, 0.1)", // Border on the right
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Border on the bottom
                    borderTop: "0px", // No border on the top
                  }}
                >
                  <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        {/* Right Column */}

        <Grid item xs={12} md={8} sx={{ mt: 3 }}>
          {/* Navbar */}

          {/* Timesheet Component */}
          <Timesheet
            events={timesheetData}
            employee_id={refEmp}
            modProjects={modProjects}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ApprovalTimesheetTablePage;
