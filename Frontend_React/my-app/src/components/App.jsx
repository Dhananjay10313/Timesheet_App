// import { Container, Row, Col } from "react-bootstrap";
// import SideBar from "./Sidebar";
// import Button from "react-bootstrap/Button";
// import MyNavbar from "./Navbar";
import EditableTable from "./ticketLayout/RefTable";
import MyForm from "./ticketLayout/TicketInpBox";
import TicketPage from "./ticketLayout/TicketPage";
import { useState, useEffect } from "react";
import LoginForm from "./loginLayout/LoginPage";
import DateInput from "./leaveLayout/leaveInput";
import LeaveEditableTable from "./leaveLayout/LeaveApply";
import LeavePage from "./leaveLayout/leavePage";
import TimesheetTablePage from "./timesheetLayout/timesheetPage";
import DashboardPage from "./dashboardLayout/dashboardPage"
import AuthProvider from "./provider/authProvider";
import ProjectForm from './projectLayout/projectPage'
import EmployeeTable from './employeeLayout/employee'

// function App() {
//   const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

//   const OpenSidebar = () => {
//     setOpenSidebarToggle(!openSidebarToggle);
//   };
//   return (
//     <>
//       <MyNavbar />
//       <Container style={{ display: "flex" }}>
//         {/* <SideBar
//           openSidebarToggle={openSidebarToggle}
//           OpenSidebar={OpenSidebar}
//         /> */}
//         {/* <LeavePage/> */}

//         <TimesheetTablePage/>

//         {/* <TicketPage /> */}
//       </Container>
//       {/* <MyForm /> */}
//       {/* <LoginForm /> */}
//     </>
//   );
// }

// export default App;

import React from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./navbar";

import Sidebar from "./Sidebar";
import ProjectPage from "./projectLayout/projectPage"
import axios from "axios";
// import AlertComponent from "./AlertComponent";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token=localStorage.getItem("token")
    if(token){
      setIsAuthenticated(true)
    }
    else{
      setIsAuthenticated(false)
    }
    // const fetchData = async () =>{
    //   await axios.post("http://localhost:8000/pushTimesheetNotFilledAlert", { emp_id: 1 }) // change with currently logged in user
    //   .then((response) => {
    //     const rem_days=response.data.rem_days
    //     console.log("rem_days", rem_days)
    //     if(rem_days>15){
    //       axios.post("http://localhost:8000/addAlert", {
    //         employee_id: 1, // change with currently logged in user
    //         alt_type: 1,
    //         alt_description: `${rem_days} Days Timesheet Data pending.`,
    //         status: 0
    //       });

    //       axios.post("http://localhost:8000/addAlert", {
    //         employee_id: 1, // change with manager id
    //         alt_type: 1,
    //         alt_description: `Employee id ${1} ${rem_days} Days Timesheet Data pending.`,
    //         status: 0
    //       });
    //     }
    //     else if(rem_days>5){
    //       axios.post("http://localhost:8000/addAlert", {
    //         employee_id: 1, // chnage with currently logged in user
    //         alt_type: 1,
    //         alt_description: `${rem_days} Days Timesheet Data pending.`,
    //         status: 0
    //       });
    //     }
    //   });
      
    // }

    const fetchData = async () => {
      try {
        console.log("Fetching data..."); // Debugging line
        const response = await axios.post("http://localhost:8000/pushTimesheetNotFilledAlert", { emp_id: 1 });
        console.log("Response received:", response); // Debugging line
        const rem_days = await response.data.rem_days;
        console.log("rem_days", rem_days); // This should now execute
    
        if (rem_days > 15) {
          await axios.post("http://localhost:8000/addAlert", {
            employee_id: 1,
            alt_type: 1,
            alt_description: `${rem_days} Days Timesheet Data pending.`,
            status: 0
          });
    
          await axios.post("http://localhost:8000/addAlert", {
            employee_id: 1,
            alt_type: 1,
            alt_description: `Employee id ${1} ${rem_days} Days Timesheet Data pending.`,
            status: 0
          });
        } else if (rem_days > 5) {
          await axios.post("http://localhost:8000/addAlert", {
            employee_id: 1,
            alt_type: 1,
            alt_description: `${rem_days} Days Timesheet Data pending.`,
            status: 0
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // const fetchData = async () => {
    //   try {
    //     console.log("Fetching data..."); // Debugging line
    //     const response = await axios.post("http://localhost:8000/pushTimesheetNotFilledAlert", { emp_id: 1 });
    //     console.log("Response received:", response); // Debugging line
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    
    
    fetchData();
    console.log("testing")
  },[])






  return (
    <>
    <AuthProvider>
    <Router>
      <div className="app-layout">
        {isAuthenticated && <Navbar Authenticate={() => setIsAuthenticated(false)}/>}

        {isAuthenticated && <Sidebar />}

        <div className="content-area">
          <Routes>

          <Route path="/login" element={isAuthenticated?<Navigate to="/dashboard" />:<LoginForm Authenticate={() => setIsAuthenticated(true)}/>} />

            <Route path="/dashboard" element={!isAuthenticated?<Navigate to="/login" />:<DashboardPage/>} />

            < Route path="/timesheet" element={!isAuthenticated?<Navigate to="/login" />:<TimesheetTablePage/>}  />

            <Route path="/leave" element={!isAuthenticated?<Navigate to="/login" />:<LeavePage/>}  />

            <Route path="/ticket" element={!isAuthenticated?<Navigate to="/login" />:<TicketPage/>}  />

            <Route path="/project" element={!isAuthenticated?<Navigate to="/login" />:<ProjectForm/>}  />

            <Route path="/employee" element={!isAuthenticated?<Navigate to="/login" />:<EmployeeTable/>} />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider></>
  );
};

export default App;
