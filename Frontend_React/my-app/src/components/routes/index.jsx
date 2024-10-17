import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
// import LoginForm from "../LoginPage";
import EditableTable from "../ticketLayout/RefTable";
import MyForm from "../ticketLayout/TicketInpBox";
import TicketPage from "../ticketLayout/TicketPage";
import { useState } from "react";
import LoginForm from "../loginLayout/LoginPage";
import DateInput from "../leaveLayout/leaveInput";
import LeaveEditableTable from "../leaveLayout/LeaveApply";
import LeavePage from "../leaveLayout/leavePage";
import TimesheetTablePage from "../timesheetLayout/timesheetPage";
import DashboardPage from "../dashboardLayout/dashboardPage"

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/dashboard",
          element: <div>{localStorage.getItem("token")}</div>,
        },
        {
          path: "/timesheet",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <div>Home Page</div>,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
