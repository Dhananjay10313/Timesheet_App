import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import BasicExample from "./creactedTable";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function MyForm() {
  const [inputValue2, setInputValue2] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [employeeSelectedOption, setEmployeeSelectedOption] = useState([]);
  const [commonEmployeeList, setCommonEmployeeList] = useState([]);
  const [data, setData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/getTicketDataByUser", { "id": 1 }) // change with currently logged in user
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      });

    axios.post("http://localhost:8000/getCommonEmployee", { emp_id: 1 }) // change with currently logged in user
      .then((response) => {
        console.log("Common Employees", response.data);
        setCommonEmployeeList(response.data);
      });
  }, []);

  const handleEmployeeChange = (event) => {
    const {
      target: { value },
    } = event;
    setEmployeeSelectedOption(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const emp = async (value) => {
    await axios.post("http://localhost:8000/getProjectBySelectedEmployee", {
      emp_id: 1, // change with currently logged in user
      co_emp_id: value
    }).then((response) => {
      setProjectData(response.data);
      console.log("Project Data", response.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      "ticket_id": Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
      "create_at": new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      "description": inputValue2,
      "status": 0, // Replace with the desired status value
      "creator_id": 1, // Replace with the creator's ID
      "project_id": parseInt(selectedOption), // Replace with the project's ID
      "ref_employee_id": employeeSelectedOption
    };

    setData([...data, formData]);

    await axios.post("http://localhost:8000/addTicketDataToTable", formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Add New Ticket
        </Typography>

        {/* Select Employee Dropdown and Description Input Side by Side */}
        <Box style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Employees</InputLabel>
            <Select
              multiple
              value={employeeSelectedOption}
              onChange={handleEmployeeChange}
              renderValue={(selected) =>
                selected
                  .map((id) => commonEmployeeList.find((e) => e.id === id)?.name)
                  .join(", ")
              }
            >
              {commonEmployeeList.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  <Checkbox checked={employeeSelectedOption.includes(employee.id)} />
                  <ListItemText primary={employee.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>

        {/* Select Project Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Project</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {projectData.map((option) => (
              <MenuItem key={option.project_id} value={option.project_id}>
                {option.project_id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Box style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginRight: "10px" }}
          >
            Add Ticket
          </Button>
        </Box>

        <BasicExample data={data} />
      </Box>
    </LocalizationProvider>
  );
}

export default MyForm;
