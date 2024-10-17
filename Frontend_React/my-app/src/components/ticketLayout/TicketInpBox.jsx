// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import BasicExample from "./creactedTable";


// function MyForm() {
//   const [inputValue1, setInputValue1] = useState("");
//   const [inputValue2, setInputValue2] = useState("");
//   const [selectedOption, setSelectedOption] = useState("");
//   const [employeeSelectedOption, setEmployeeSelectedOption] = useState(2);
//   const [commonEmployeeList, setCommonEmployeeList] = useState([])
//   const [data, setData] = useState([]);
//   const [projectData,setProjectData] = useState([])


//   useEffect(()=>{
//     axios.post(
//       "http://localhost:8000/getTicketDataByUser"
//      ,
//       {
//         "id":1 // change with currently logged in user
//       }
//     ).then((response)=>{
//       console.log(response.data)
//       setData(response.data)
//     });

//     axios.post(
//       "http://localhost:8000/getCommonEmployee"
//      ,
//       {
//         emp_id:1 // change with currently logged in user
//       }
//     ).then((response)=>{
//       console.log("kjahdkahdkh",response.data)
//       setCommonEmployeeList(response.data)
//     });

//   },[])

//   const emp= async(value) => {
//     // setEmployeeSelectedOption(value);
//     // // await axios.post("/")
//     // console.log("employeeSelectedOption", value)
//     // await axios.post("http://localhost:8000/getProjectBySelectedEmployee",{
//     //   emp_id: 1 // change by currently logged in user
//     //   co_emp_id: employeeSelectedOption
//     // }).then((response)=>{
//     //   setProjectData(response.data)
//     // })
//      console.log('sdasdadsadadasdsdas',value)
//     await axios.post(
//       "http://localhost:8000/getProjectBySelectedEmployee"
//      ,
//       {
//         emp_id:1, // change with currently logged in user
//         co_emp_id: value 
//       }
//     ).then((response)=>{
//       setProjectData(response.data)
//       console.log("H13",response.data)
//     });

//     // console.log("opus",employeeSelectedOption)
//   }

//   const handleEmployeeSelect = (value) => {
//     setEmployeeSelectedOption(value);
//     console.log("employeeSelectedOption", value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Input 1:", inputValue1);
//     console.log("Input 2:", inputValue2);
//     // setInputValue1(""), setInputValue2("");
   
//     const formData={
//       "ticket_id":  Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
//       "create_at": "2024-10-08", // Replace with the desired date in YYYY-MM-DD format
//       "description": inputValue2,
//       "status": 0, // Replace with the desired status value
//       "creator_id": 1, // Replace with the creator's ID
//       "project_id": parseInt(selectedOption), // Replace with the project's ID
//       "ref_employee_id": employeeSelectedOption
//     }
//     // const formData = {
//     //   "ticket_id": 0,
//     //   "create_at": "2024-10-08",
//     //   "description": "string",
//     //   "status": 0,
//     //   "creator_id": 1,
//     //   "project_id": 1,
//     //   "ref_employee_id": 1
//     // }

//     setData([...data, formData]);

//     await axios.post(
//       "http://localhost:8000/addTicketDataToTable"
//      ,
//      formData
//     )

    

//   };

//   return (
//     <div>
//     <div className="container ticket-container">
//       <form onSubmit={handleSubmit}>
//         <div className="row">
//         <div className="col-md-6">
//             <label htmlFor="select" className="form-label">
//               Select Employee
//             </label>
//             <select
//               className="form-select"
//               id="select"
//               value={employeeSelectedOption}
//               onChange={(e) => {handleEmployeeSelect(e.target.value)
//                 emp(e.target.value)
//               }}
//             >
//                 <option value={11}>Select...</option>
//                 {commonEmployeeList.map((option)=>(
//                   <option key={option.id} value={option.id}>{option.id}</option>
//                 ))}
//               {/* <option value="">Select...</option>
//               <option value="1">Option 1</option>
//               <option value="1">Option 2</option> */}
              
//             </select>
//           </div>
//           <div className="col-md-6">
//             <label htmlFor="input2" className="form-label">
//               Description
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="input2"
//               value={inputValue2}
//               onChange={(e) => setInputValue2(e.target.value)}
//             />
//           </div>

//           <div className="col-md-6">
//             <label htmlFor="select" className="form-label">
//               Select Project
//             </label>
//             <select
//               className="form-select"
//               id="select"
//               value={selectedOption}
//               onChange={(e) => setSelectedOption(e.target.value)}
//             >

//               <option value="">Select...</option>
//                 {projectData.map((option)=>(
//                   <option key={option.project_id} value={option.project_id}>{option.project_id}</option>
//                 ))}

//               {/* <option value="">Select...</option>
//               <option value="1">Option 1</option>
//               <option value="1">Option 2</option> */}
//               {/* Add more options as needed */}
//             </select>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-primary mt-3">
//           Submit
//         </button>
//       </form>
//     </div>
//     <BasicExample data={data}/>
//     </div>
//   );
// }

// export default MyForm;


import axios from "axios";
import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid } from "@mui/material";
import { ToastContainer } from "react-toastify";
import BasicExample from "./creactedTable";

function MyForm() {
  const [inputValue2, setInputValue2] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [employeeSelectedOption, setEmployeeSelectedOption] = useState(0);
  const [commonEmployeeList, setCommonEmployeeList] = useState([]);
  const [data, setData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/getTicketDataByUser", { id: 1 }) // change with currently logged in user
      .then((response) => {
        setData(response.data);
      });

    axios.post("http://localhost:8000/getCommonEmployee", { emp_id: 1 }) // change with currently logged in user
      .then((response) => {
        setCommonEmployeeList(response.data);
      });
  }, []);

  const emp = async (value) => {
    console.log("here: ", value)
    await axios.post("http://localhost:8000/getProjectBySelectedEmployee", {
      emp_id: 1, // change with currently logged in user
      co_emp_id: value
    }).then((response) => {
      setProjectData(response.data);
    });
  };

  const handleEmployeeSelect = (value) => {
    setEmployeeSelectedOption(value);
    emp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ticket_id: Math.floor(Math.random() * (10000 - 1 + 1)) + 1,
      create_at: "2024-10-08", // Replace with the desired date in YYYY-MM-DD format
      description: inputValue2,
      status: 0, // Replace with the desired status value
      creator_id: 1, // Replace with the creator's ID
      project_id: parseInt(selectedOption), // Replace with the project's ID
      ref_employee_id: employeeSelectedOption
    };

    setData([...data, formData]);

    await axios.post("http://localhost:8000/addTicketDataToTable", formData);

    // await axios.post("http://localhost:8000/")
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h2>Create Ticket</h2>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={employeeSelectedOption}
                onChange={(e) => {handleEmployeeSelect(e.target.value)
                  emp(e.target.value)
                } }
              >
                <MenuItem value={0}>Select...</MenuItem>
                {commonEmployeeList.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Project</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {projectData.map((option) => (
              <MenuItem key={option.project_id} value={option.project_id}>{option.project_id}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      <BasicExample data={data} />
    </LocalizationProvider>
  );
}

export default MyForm;
