// import { Container, Row, Col } from "react-bootstrap";
// import SideBar from "./Sidebar";
// import Button from "react-bootstrap/Button";
// import MyNavbar from "./Navbar";
import EditableTable from "./ticketLayout/RefTable";
import MyForm from "./ticketLayout/TicketInpBox";
import TicketPage from "./ticketLayout/TicketPage";
import { useState } from "react";
import LoginForm from "./loginLayout/LoginPage";
import DateInput from "./leaveLayout/leaveInput";
import LeaveEditableTable from "./leaveLayout/LeaveApply";
import LeavePage from "./leaveLayout/leavePage";
import TimesheetTablePage from "./timesheetLayout/timesheetPage";
import DashboardPage from './dashboardLayout/dashboardPage'
import ProjectForm from './projectLayout/projectPage'

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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./navbar";

import Sidebar from "./Sidebar";

// import AlertComponent from "./AlertComponent";

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />

        <Sidebar />

        <div className="content-area">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage/>} />

            <Route path="/timesheet" element={<TimesheetTablePage/>} />

            <Route path="/leave" element={<LeavePage/>} />

            <Route path="/ticket" element={<TicketPage/>} />

            <Route path="/project" element={<ProjectForm/>} />

            <Route path="/employee" element={<div></div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
