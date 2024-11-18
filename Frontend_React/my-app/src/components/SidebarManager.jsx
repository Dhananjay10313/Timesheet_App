import React, { useState, useContext, useEffect } from "react";
import {
  Drawer,
  Box,
  ListItemText,
  ListItemIcon,
  Collapse,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import WorkIcon from "@mui/icons-material/Work";
import GroupIcon from "@mui/icons-material/Group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AuthContext from "./provider/authProvider"
import { useAuth } from "./provider/authProvider";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState({
    timesheet: false,
    leave: false,
    ticket: false,
  });

  const storedData = localStorage.getItem("userData");
  const userState1 = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState1["emp_id"];
  const manager_id = userState1["manager_id"];
  const is_manager = userState1["is_manager"];

  const {route, setRoute, userState, setUserState} = useAuth()

  const handleMenuToggle = (menu) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const menuItems =
    is_manager == 1
      ? [
          {
            text: "Dashboard",
            icon: <DashboardIcon sx={{ color: "#ffffff" }} />,
            link: "/dashboard",
          },
          {
            text: "Timesheet",
            icon: <AccessTimeIcon sx={{ color: "#ffffff" }} />,
            subItems: [
              { text: "Fill Timesheet", link: "/timesheet" },
              { text: "Approve Timesheet", link: "/approvetimesheet" },
            ],
          },
          {
            text: "Leave",
            icon: <BeachAccessIcon sx={{ color: "#ffffff" }} />,
            subItems: [
              { text: "Apply Leave", link: "/leave" },
              { text: "Leave Approval", link: "/leave-approval" },
            ],
          },
          {
            text: "Ticket",
            icon: <ConfirmationNumberIcon sx={{ color: "#ffffff" }} />,
            subItems: [
              { text: "New Ticket", link: "/ticket" },
              { text: "Ticket Approval", link: "/ticket-approval" },
            ],
          },
          {
            text: "Project",
            icon: <WorkIcon sx={{ color: "#ffffff" }} />,
            link: "/project",
          },
          {
            text: "Employee",
            icon: <GroupIcon sx={{ color: "#ffffff" }} />,
            link: "/employee",
          },
        ]
      : [
          {
            text: "Timesheet",
            icon: <AccessTimeIcon sx={{ color: "#ffffff" }} />,
            link: "/timesheet",
          },
          {
            text: "Leave",
            icon: <BeachAccessIcon sx={{ color: "#ffffff" }} />,
            link: "/leave",
          },
          {
            text: "Ticket",
            icon: <ConfirmationNumberIcon sx={{ color: "#ffffff" }} />,
            subItems: [
              { text: "New Ticket", link: "/ticket" },
              { text: "Ticket Approval", link: "/ticket-approval" },
            ],
          },
        ];

    useEffect(()=>{
      console.log("Route: ", userState)
    },[userState])

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: 240,
        flexShrink: 0,
        zIndex: 1000,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1c1c1e", // Dark background
          color: "#ffffff", // White text color
          top: 64,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem
                button
                component={Link}
                to={item.link || "#"}
                onClick={() =>
                  {item.subItems && handleMenuToggle(item.text.toLowerCase());
                    setRoute(item.text.toLowerCase());
                  }
                }
              >
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: "#ffffff" }} />
                {item.subItems &&
                  (openMenu[item.text.toLowerCase()] ? (
                    <ExpandLess sx={{ color: "#ffffff" }} />
                  ) : (
                    <ExpandMore sx={{ color: "#ffffff" }} />
                  ))}
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={openMenu[item.text.toLowerCase()]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        button
                        component={Link}
                        to={subItem.link}
                        sx={{ pl: 4 }}
                        key={subItem.text}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{ color: "#ffffff" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
              {index < menuItems.length - 1 && (
                <Divider sx={{ backgroundColor: "#ffffff" }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
