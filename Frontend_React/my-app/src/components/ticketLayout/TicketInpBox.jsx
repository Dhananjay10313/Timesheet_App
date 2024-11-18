import axios from "axios";
import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import UpperEditableTable from "./creactedTable";

function MyForm() {
  const [inputValue2, setInputValue2] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [employeeSelectedOption, setEmployeeSelectedOption] = useState(0);
  const [commonEmployeeList, setCommonEmployeeList] = useState([]);
  const [data, setData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    axios
      .post(
        "http://localhost:8000/getTicketDataByUser",
        { id: employee_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setData(response.data);
      });

    axios
      .post("http://localhost:8000/getProjectByEmployee", {
        emp_id: employee_id,
      })
      .then((response) => {
        setProjectData(response.data);
      });
  }, []);

  // useEffect(() => {
  //   // console.log("here: ", value)

  // }, [selectedOption]);

  const emp = async (value) => {
    // console.log("here: ", value)
    // await axios.post("http://localhost:8000/getProjectBySelectedEmployee", {
    //   emp_id: 1,
    //   co_emp_id: value
    // }).then((response) => {
    //   setProjectData(response.data);
    // });
    //console.log("value", value);

    await axios
      .post("http://localhost:8000/getEmployeeByProject", {
        project_id: value,
        emp_id: employee_id,
      })
      .then((response) => {
        setCommonEmployeeList(response.data);
      });
  };

  useEffect(() => {
    //console.log("Employee List", commonEmployeeList);
  }, [commonEmployeeList]);

  const handleProjectSelect = async (value) => {
    emp(value);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEmployeeSelect = async (value) => {
    setEmployeeSelectedOption(value);
    // emp(value);
    // await axios.post("http://localhost:8000/getProjectBySelectedEmployee", {
    //   emp_id: 1,
    //   co_emp_id: employeeSelectedOption
    // }).then((response) => {
    //   setProjectData(response.data);
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticket_id = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const formData = {
      ticket_id: ticket_id,
      create_at: getCurrentDate(),
      description: inputValue2,
      status: 0,
      creator_id: employee_id,
      project_id: parseInt(selectedOption),
      ref_employee_id: employeeSelectedOption,
    };

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: employeeSelectedOption,
      alt_type: 3,
      alt_description: `Ticket ID ${ticket_id} raised by employee ID ${employee_id} `,
      status: 0,
    });

    setData([...data, formData]);

    await axios.post("http://localhost:8000/addTicketDataToTable", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    // await axios.post("http://localhost:8000/")
    setInputValue2("");
    setSelectedOption("");
    setEmployeeSelectedOption(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h2>Create Ticket</h2>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.target.value),
                    handleProjectSelect(e.target.value);
                }}
              >
                {projectData.map((option) => (
                  <MenuItem value={option.project_id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={inputValue2}
              onChange={(e) => {
                setInputValue2(e.target.value);
              }}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={employeeSelectedOption}
            onChange={(e) => {
              handleEmployeeSelect(e.target.value);
              // emp(e.target.value)
            }}
          >
            {commonEmployeeList.map((option) => (
              <MenuItem key={option.id} value={option.employee_id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      <UpperEditableTable data={data} />
    </LocalizationProvider>
  );
}

export default MyForm;
