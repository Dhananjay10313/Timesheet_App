// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";

// // Hardcoded employee list removed - it will now be fetched from dummy endpoint

// const ProjectForm = () => {
//   const [description, setDescription] = useState("");
//   const [startTime, setStartTime] = useState(dayjs().startOf("day"));
//   const [deadline, setDeadline] = useState(dayjs().add(1, "month"));
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [employeeList, setEmployeeList] = useState([
//     { id: 1, name: "Alice" },
//     { id: 2, name: "Bob" },
//     { id: 3, name: "Charlie" },
//     { id: 4, name: "David" },
//     { id: 5, name: "Eve" },
//   ]);
//   const [projects, setProjects] = useState([]);

//   // Fetch employees and projects from dummy endpoints when the component mounts
//   useEffect(() => {
//     // Dummy request to fetch employee list
//     // axios.get("/api/employees").then((response) => {
//     //   setEmployeeList(response.data);
//     // });

//     // // Dummy request to fetch existing projects
//     // axios.get("/api/projects").then((response) => {
//     //   setProjects(response.data);
//     // });
//   }, []);

//   const handleSubmit = () => {
//     const projectData = {
//       description,
//       startTime: startTime.format("YYYY-MM-DD"),
//       deadline: deadline.format("YYYY-MM-DD"),
//       employeeCount: selectedEmployees.length,
//     };

//     const newProjectId = projects.length + 1;

//     // Dummy POST request to add the new project to the projects table
//     axios.post("/api/projects", projectData).then((response) => {
//       setProjects([...projects, { ...projectData, id: newProjectId }]);
//     });

//     // Dummy POST request to add selected employees to project-employee relationship table
//     const employeeData = selectedEmployees.map((employeeId) => ({
//       projectId: newProjectId,
//       employeeId,
//     }));

//     axios.post("/api/project-employees", employeeData).then((response) => {
//       console.log("Employees added to project:", employeeData);
//     });

//     // Clear form
//     setDescription("");
//     setStartTime(dayjs().startOf("day"));
//     setDeadline(dayjs().add(1, "month"));
//     setSelectedEmployees([]);
//   };

//   const handleEmployeeChange = (event) => {
//     setSelectedEmployees(event.target.value);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div style={{ padding: "20px" }}>
//         <h2>Add New Project</h2>

//         {/* Project Description Input */}
//         <TextField
//           label="Project Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           fullWidth
//           margin="normal"
//         />

//         {/* Date Pickers for Start Time and Deadline */}
//         <div style={{ display: "flex", gap: "20px", marginBottom: "20px", justifyContent: "flex-start" }}>
//           <DatePicker
//             label="Start Time"
//             value={startTime}
//             onChange={(newDate) => setStartTime(newDate)}
//             renderInput={(params) => <TextField {...params} />}
//           />
//           <DatePicker
//             label="Deadline"
//             value={deadline}
//             onChange={(newDate) => setDeadline(newDate)}
//             renderInput={(params) => <TextField {...params} />}
//           />
//         </div>

//         {/* Multi-select Dropdown for Employees */}
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Select Employees</InputLabel>
//           <Select
//             multiple
//             value={selectedEmployees}
//             onChange={handleEmployeeChange}
//             renderValue={(selected) =>
//               selected.map((id) => employeeList.find((e) => e.id === id)?.name).join(", ")
//             }
//           >
//             {employeeList.map((employee) => (
//               <MenuItem key={employee.id} value={employee.id}>
//                 <Checkbox checked={selectedEmployees.includes(employee.id)} />
//                 <ListItemText primary={employee.name} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Submit Button */}
//         <Button variant="contained" color="primary" onClick={handleSubmit}>
//           Add Project
//         </Button>

//         {/* Display List of Projects */}
//         <h3>Existing Projects</h3>
//         <ul>
//           {projects.map((project) => (
//             <li key={project.id}>
//               {project.description} (Start: {project.startTime}, Deadline: {project.deadline}, Employees:{" "}
//               {project.employeeCount})
//             </li>
//           ))}
//         </ul>
//       </div>
//     </LocalizationProvider>
//   );
// };

// export default ProjectForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ProjectForm = () => {
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(dayjs().startOf("day"));
  const [deadline, setDeadline] = useState(dayjs().add(1, "month"));
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeList, setEmployeeList] = useState([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
  ]);
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectName, setProjectName] = useState(null);

  const [projectsi, setProjectsi] = useState([
    { id: 1, name: "Project A", description: "Description A" },
    { id: 2, name: "Project B", description: "Description B" },
    { id: 3, name: "Project C", description: "Description C" },
  ]);

  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .post("http://localhost:8000/getProjectDataByManagerId", {
          manager_id: employee_id, //employee_id,
        })
        .then((response) => {
          setProjects(response.data);
        });

      console.log("Employee ID", employee_id);
      await axios
        .post("http://localhost:8000/getEmployeeInfoByManger", {
          manager_id: employee_id,
        })
        .then((response) => {
          setEmployeeList(response.data);
        });
    };

    fetchData();

    // // axios.get("/api/projects").then((response) => {
    // //   setProjects(response.data);
    // });
  }, []);

  const fetchProjectEmployees = async (projectId) => {
    // await axios.get(`/api/project-employees?projectId=${projectId}`).then((response) => {
    //   setSelectedEmployees(response.data.map((emp) => emp.employeeId));
    // });
    return 0;
  };

  useEffect(() => {
    console.log("projects initial", projects);
  }, []);

  const handleSubmit = async () => {
    const strProjectId = Math.floor(Math.random() * 100000);
    const projectData = {
      project_id: strProjectId,
      name: projectName,
      description,
      startTime: startTime.format("YYYY-MM-DD"),
      deadline: deadline.format("YYYY-MM-DD"),
      employeeCount: selectedEmployees.length,
    };
    console.log("projectData", projectData);

    if (isEditing) {
      // Dummy PUT request to update the existing project
      // axios.put(`/api/projects/${selectedProjectId}`, projectData).then(() => {
      // const projectCopy = projects.map(
      //   (project) =>{
      //     project.id == selectedProjectId ? projectData:project
      //   }
      // )
      // console.log("Project Copy", projectCopy)

      // const updateProjectList = (projects, updatedProject) => {
      //   return projects.map(project =>
      //     project.id === selectedProjectId ? {console.log()} : project
      //   );
      // };

      // const handleUpdate = () => {
      //   const newProjects = updateProjectList(projects, projectData);
      //   // setProjects(newProjects);
      //   console.log(newProjects)
      // };

      // setProjects((prev) =>
      //   prev.map((project) =>
      //     project.id === selectedProjectId
      //       ? {projectData}
      //       : project
      //   )
      // );

      const updatedProject = {
        id: 2,
        name: "Updated Project B",
        description: "Updated Description B",
      };

      const updateProjectf = (updatedProject) => {
        const newProjects = projectsi.map((project) => {
          project.id === updatedProject.id
            ? { ...project, ...updatedProject }
            : project;
          project.id === updatedProject.id ? console.log("herererer") : 0;
        });
        setProjectsi(newProjects);
      };

      updateProjectf(updatedProject);
      console.log("projectsi", projectsi);

      resetForm();
      // });
    } else {
      const newProjectId = projects.length + 1;

      console.log("Selected Employees List", selectedEmployees);

      await axios
        .post("http://localhost:8000/addProjectData", {
          project_id: strProjectId,
          name: projectName,
          description,
          start_date: startTime.format("YYYY-MM-DD"),
          deadline: deadline.format("YYYY-MM-DD"),
          employee_count: selectedEmployees.length+1,
          manager_id: employee_id,
        })
        .then((response) => {
          setProjects([...projects, { ...projectData, id: strProjectId }]);
          console.log(response.data);
          resetForm();
        });

      const employeeData = selectedEmployees.map((employeeId) => ({
        projectId: strProjectId,
        employeeId,
      }));

      selectedEmployees.map((employee_id) =>
        axios.post("http://localhost:8000/addEmployeeProjects", {
          project_id: strProjectId,
          employee_id,
        })
      );

      axios.post("http://localhost:8000/addEmployeeProjects", {
        project_id: strProjectId,
        employee_id: employee_id,
      });

      // axios.post("/api/project-employees", employeeData).then(() => {
      console.log("Employees added to project:", employeeData);
      // });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleEmployeeChange = (event) => {
    setSelectedEmployees(event.target.value);
    // setSelectedEmployees([...selectedEmployees,employee_id])
  };

  const handleProjectSelect = (project) => {
    setSelectedProjectId(project.id);
    setDescription(project.description);
    setStartTime(dayjs(project.startTime));
    setDeadline(dayjs(project.deadline));
    setIsEditing(true);
    fetchProjectEmployees(project.id);
  };

  const resetForm = () => {
    setDescription("");
    setProjectName("");
    setStartTime(dayjs().startOf("day"));
    setDeadline(dayjs().add(1, "month"));
    setSelectedEmployees([]);
    setIsEditing(false);
    setSelectedProjectId(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: "20px" }}>
        <h2>{isEditing ? "Edit Project" : "Add New Project"}</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            justifyContent: "flex-start",
          }}
        >
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ width: "500px" }}
          />

          <TextField
            label="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            justifyContent: "flex-start",
          }}
        >
          <DatePicker
            label="Start Time"
            value={startTime}
            onChange={(newDate) => setStartTime(newDate)}
            minDate={dayjs()}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Deadline"
            value={deadline}
            onChange={(newDate) => setDeadline(newDate)}
            minDate={startTime || dayjs()}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>

        <FormControl fullWidth margin="2px">
          <InputLabel>Select Employees</InputLabel>
          <Select
            multiple
            value={selectedEmployees}
            onChange={handleEmployeeChange}
            renderValue={(selected) =>
              selected
                .map((id) => employeeList.find((e) => e.id === id)?.name)
                .join(", ")
            }
          >
            {employeeList.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                <Checkbox checked={selectedEmployees.includes(employee.id)} />
                <ListItemText primary={employee.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginRight: "10px" }}
          >
            {isEditing ? "Update Project" : "Add Project"}
          </Button>
          {isEditing && (
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>

        <h3 style={{ marginTop: "40px" }}>Project List</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>No. of Employees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{project.project_id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.startTime}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>{project.employeeCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </LocalizationProvider>
  );
};

export default ProjectForm;
