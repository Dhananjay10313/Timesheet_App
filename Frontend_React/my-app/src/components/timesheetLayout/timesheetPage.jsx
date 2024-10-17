// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// import "../App.css";
// import axios from "axios";
// import Timesheet from "./timesheet";

// // async function fetchTimesheetData(emp_id){
// //     axios.post(
// //         "http://localhost:8000/getTimesheetDataByUser"
// //        ,
// //         {
// //           "emp_id":emp_id
// //         }
// //       ).then((response)=>{
// //         console.log("here")
// //         console.log(response.data)
// //         return response.data
// //       });
// // }

// async function fetchTimesheetData(emp_id) {
//   try {
//     const response = await axios.post("http://localhost:8000/getTimesheetDataByUser", {
//       emp_id: emp_id,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching timesheet data:", error);
//     return [];
//   }
// }

// function TimesheetTablePage() {
//   const [timesheetData, setTimesheetData] = useState([{
//     id: 7,
//     employee_id: 1,
//     end: "2024-10-06T11:15:44",
//     manager_id: null,
//     project: 1,
//     start: "2024-10-06T11:15:44",
//     status: 1,
//     text: "string",
//   }]);
//   const [data, setData] = useState([{id:"numa",name:"jdsh",status:"io"}]);
//   const [refEmp,setRefEmp] =useState(1)
//   const [formattedData, setFormattedData] = useState([{}])
//   // const response = axios.post(
//   //   "http://localhost:8000/getTicketDataByUser"
//   //  ,
//   //   {
//   //     "id":1
//   //   })
//   //   console.log(response)

//   useEffect(()=>{
//     // setTimesheetData(fetchTimesheetData(refEmp));
//     axios.post(
//       "http://localhost:8000/getTimesheetDataByUser"
//      ,
//       {
//         "emp_id":1
//       }
//     ).then((response)=>{
//       console.log("here")
//       console.log(response.data)
//       setTimesheetData(response.data)
//       console.log("kjahdjkah")
//     console.log(timesheetData)
//     })

//     const listRet=[]
//         const formattedData1 = timesheetData.map(item => (listRet.push({
//           id: item.id,
//           text: item.task,
//           start: item.start,
//           end: item.end,
//           project: item.project_id
//         })));

//         setFormattedData(listRet)
//         console.log("ListRet")
//         console.log(listRet)

//     axios.post(
//         "http://localhost:8000/getTimesheetApprovalRequestByManager"
//        ,
//         {
//           "manager_id":1
//         }
//       ).then((response)=>{
//         console.log(response.data)
//         setData(response.data)
//       });
//   },[])

//   const handleRowClick = (index) => {
//         setRefEmp(data[index].employee_id);
//         setTimesheetData(fetchTimesheetData(refEmp));

//         const listRet=[]
//         const formattedData1 = timesheetData.map(item => (listRet.append({
//           id: item.id,
//           text: item.task,
//           start: item.start,
//           end: item.end,
//           project: item.project_id
//         })));

//         setFormattedData(listRet)
//         console.log("ListRet")
//         console.log(listRet)
//     }

//     // Display information about the row

//   return (
//     <Container>
//         <Timesheet events={formattedData}/>

//       <div className="keep-space-bet-components">
//         <span>For You</span>
//       </div>

//       <Table striped bordered hover responsive="xl">
//         <thead>
//           <tr>
//             <th>Approval Id</th>
//             <th>Employee Id</th>
//             <th>Created At</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index} onClick={() => handleRowClick(index)}>
//               <td>{row.ap_id}</td>
//               <td>{row.employee_id}</td>
//               <td>{row.create_at}</td>
//               <td>{row.status===1?"Pending":(row.status===2?"Accepted":"Rejected")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default TimesheetTablePage;

// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// // import "../App.css";
// import axios from "axios";
// import Timesheet from "./timesheet";
// import { ChromeReaderMode } from "@mui/icons-material";
// // import './timesheet.css'

// async function fetchTimesheetData(emp_id) {
//   try {
//     const response = await axios.post(
//       "http://localhost:8000/getTimesheetDataByUser",
//       {
//         emp_id: emp_id,
//       }
//     );
//     console.log("fetchrrrrrrrrrrrrrrrrrrrrrrr", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching timesheet data:", error);
//     return [];
//   }
// }

// function TimesheetTablePage() {
//   const [timesheetData, setTimesheetData] = useState([
//     {
//       id: 7,
//       employee_id: 1,
//       end: "2024-10-06T11:15:44",
//       manager_id: null,
//       project: 1,
//       start: "2024-10-06T11:15:44",
//       status: 1,
//       text: "string",
//     },
//   ]);
//   const [data, setData] = useState([
//     { id: "numa", name: "jdsh", status: "io" },
//   ]);
//   const [refEmp, setRefEmp] = useState(1);
//   const [formattedData, setFormattedData] = useState([]);

//   const [isButtonClicked, setIsButtonClicked] = useState(false);
//   const [appId, setAppId] = useState(12);
//   const [isDisabledB, setIsDisabledB] = useState(false);
//   const [tmStatus, setTmStatus] = useState(false);
//   const [ind, setInd] = useState(0);
//   const [projects, setProjects] = useState([]);
//   const [modProjects, setModProjects] = useState([])

//   useEffect(() => {
//     const fetchData = async () => {
//       const timesheetResponse = await fetchTimesheetData(refEmp);
//       console.log("timesheetData updated: ", timesheetResponse);
//       setTimesheetData(timesheetResponse);
//       console.log("timesheetData updated: ", timesheetData);

//       const formattedDataList = timesheetResponse.map((item) => ({
//         id: item.id,
//         text: item.text,
//         start: item.start,
//         end: item.end,
//         project: item.project,
//       }));
//       setFormattedData(formattedDataList);
//       console.log("timesheetData updated: ", timesheetData);

//       try {
//         const approvalResponse = await axios.post(
//           "http://localhost:8000/getTimesheetApprovalRequestByManager",
//           {
//             manager_id: 1,
//           }
//         );
//         setData(approvalResponse.data);
//       } catch (error) {
//         console.error("Error fetching approval data:", error);
//       }

//       try {
//         console.log("here");
//         const projectResponse = await axios.post(
//           "http://localhost:8000/getProjectDataByuser",
//           {
//             emp_id: 1, //change to current user
//           }
//         );
//         setProjects(projectResponse.data);
//       } catch (error) {
//         console.error("Error fetching project data:", error);
//       }
//     };

//     fetchData();
//   }, [refEmp]);

//   useEffect(() => {
//     console.log("timesheetData updated: ", timesheetData);
//     console.log("projects", projects);

//     const generateProjectDetails = (id) => {
//       const projectNames = [
//         "Project A",
//         "Project B",
//         "Project C",
//         "Project D",
//         "Project E",
//       ];
//       const projectColors = [
//         "#38761d",
//         "#0d8ecf",
//         "#f1c232",
//         "#e06666",
//         "#6aa84f",
//       ];
//       return {
//         id: id,
//         name: "Project" + String.fromCharCode(64+id), 
//         color: "#38761d",
//       };
//     };

//     // Create a new list of projects based on fetched data
//     const modProjects1 = projects.map((fp) =>
//       generateProjectDetails(fp.project_id)
//     );
//     setModProjects(modProjects1)

//     console.log("modified project",modProjects)
//   }, [timesheetData, projects]);

//   const handleAccept = async () => {
//     const tempArr = [...data];
//     tempArr[ind].status = 2;
//     setData(tempArr);
//     setTmStatus(true);
//     // setIsDisabledB(true)
//     await axios.post("http://localhost:8000/postTimesheetApproveReq", {
//       ap_id: appId,
//     });
//   };

//   const handleReject = async () => {
//     const tempArr = [...data];
//     tempArr[ind].status = 3;
//     setData(tempArr);
//     setTmStatus(true);
//     // setIsDisabledB(true)
//     await axios.post("http://localhost:8000/postTimesheetRejectReq", {
//       ap_id: appId,
//     });
//   };

//   const handleSend = async () => {
//     setIsDisabledB(true);
//     await axios.post("http://localhost:8000/addTimesheetForApproval", {
//       employee_id: 1, // change with currently logged in user
//       manager_id: 1, // change with manager id
//     });
//   };

//   const handleDelete = async () => {
//     setIsDisabledB(true);
//     setTimesheetData([]);
//     await axios.delete("http://localhost:8000/deleteTimesheetData", {
//       // emp_id: 1 // change with currently logged in user
//       // manager_id:1 // change with manager id
//       data: { emp_id: 1 },
//     });
//   };

//   const handleRowClick = async (index) => {
//     const employeeId = data[index].employee_id;
//     setRefEmp(employeeId);
//     setAppId(data[index].ap_id);
//     setTmStatus(data[index].status == 1 ? false : true);
//     setInd(index);
//     console.log("index", data[index].status);

//     const timesheetResponse = await fetchTimesheetData(employeeId);
//     setTimesheetData(timesheetResponse);

//     const formattedDataList = timesheetResponse.map((item) => ({
//       id: item.id,
//       text: item.text,
//       start: item.start,
//       end: item.end,
//       project: item.project,
//     }));
//     setFormattedData(formattedDataList);
//   };

//   return (
//     <Container>
//       {/* <div className="container">
//         <div className="left-text">This is the text on the left.</div>
//         <div className="right-buttons">
//           <button disabled={isButtonClicked} onClick={handleClick}>
//             Button 1
//           </button>
//           <button disabled={isButtonClicked} onClick={handleClick}>
//             Button 2
//           </button>
//         </div>
//       </div> */}

//       {refEmp !== 1 ? ( // change to current user
//         <nav className="navbar">
//           <div className="navbar-text">
//             {/* Your text content here */}
//             {refEmp}
//           </div>
//           <div className="navbar-buttons">
//             <button disabled={tmStatus} onClick={handleAccept}>
//               Accept
//             </button>
//             <button disabled={tmStatus} onClick={handleReject}>
//               Reject
//             </button>
//           </div>
//         </nav>
//       ) : (
//         <nav className="navbar">
//           <div className="navbar-text">
//             {/* Your text content here */}
//             {refEmp}
//           </div>
//           <div className="navbar-buttons">
//             <button disabled={isDisabledB} onClick={handleSend}>
//               Send
//             </button>
//             <button disabled={isDisabledB} onClick={handleDelete}>
//               Delete
//             </button>
//           </div>
//         </nav>
//       )}

//       <Timesheet events={timesheetData} employee_id={refEmp} modProjects={modProjects}/>

//       <div className="keep-space-bet-components">
//         <span>For You</span>
//       </div>

//       <Table striped bordered hover responsive="xl">
//         <thead>
//           <tr>
//             <th>Approval Id</th>
//             <th>Employee Id</th>
//             <th>Created At</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index} onClick={() => handleRowClick(index)}>
//               <td>{row.ap_id}</td>
//               <td>{row.employee_id}</td>
//               <td>{row.created_at}</td>
//               <td>
//                 {row.status === 1
//                   ? "Pending"
//                   : row.status === 2
//                   ? "Accepted"
//                   : "Rejected"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default TimesheetTablePage;




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

async function fetchTimesheetData(emp_id) {
  try {
    const response = await axios.post(
      "http://localhost:8000/getTimesheetDataByUser",
      {
        emp_id: emp_id,
      }
    );
    console.log("fetch data", response.data);
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
  const [data, setData] = useState([{ id: "numa", name: "jdsh", status: "io" }]);
  const [refEmp, setRefEmp] = useState(1);
  const [formattedData, setFormattedData] = useState([]);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [appId, setAppId] = useState(12);
  const [isDisabledB, setIsDisabledB] = useState(false);
  const [tmStatus, setTmStatus] = useState(false);
  const [ind, setInd] = useState(0);
  const [projects, setProjects] = useState([]);
  const [modProjects, setModProjects] = useState([]);

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
            manager_id: 1,
          }
        );
        setData(approvalResponse.data);
      } catch (error) {
        console.error("Error fetching approval data:", error);
      }

      try {
        const projectResponse = await axios.post(
          "http://localhost:8000/getProjectDataByuser",
          {
            emp_id: 1,
          }
        );
        setProjects(projectResponse.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, [refEmp]);

  useEffect(() => {
    const generateProjectDetails = (id) => {
      return {
        id: id,
        name: "Project" + String.fromCharCode(64 + id),
        color: "#38761d",
      };
    };

    const modProjects1 = projects.map((fp) =>
      generateProjectDetails(fp.project_id)
    );
    setModProjects(modProjects1);
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
      status: 0
    });
  };

  const handleSend = async () => {
    setIsDisabledB(true);
    await axios.post("http://localhost:8000/addTimesheetForApproval", {
      employee_id: 1,
      manager_id: 1,
    });
  };

  const handleDelete = async () => {
    setIsDisabledB(true);
    setTimesheetData([]);
    await axios.delete("http://localhost:8000/deleteTimesheetData", {
      data: { emp_id: 1 },
    });
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
    <Container>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#e6e6e6" , marginBottom: "10px"}}>
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
      </AppBar>

      {/* Timesheet Component */}
      <Timesheet
        events={timesheetData}
        employee_id={refEmp}
        modProjects={modProjects}
      />

      {/* Space between Timesheet and Table */}
      <Box mb={3} /> {/* Add margin bottom to create space */}

      <Typography variant="h4" style={{ marginTop: "60px", marginBottom: "10px" }}>
        Timesheets for Approval
      </Typography>

      {/* Approval Request Table */}
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
      </TableContainer>
    </Container>
  );
}

export default TimesheetTablePage;
