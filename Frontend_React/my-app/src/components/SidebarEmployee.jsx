import React, { useState } from "react";
import {
  Drawer,
  Box,
  ListItemText,
  ListItemIcon,
  Collapse,
  List,
  ListItem,
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

const SidebarEmployee = ({ isOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState({
    timesheet: false,
    leave: false,
    ticket: false,
  });

  const handleMenuToggle = (menu) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1c1c1e", // Dark background
          color: "#ffffff", // White text color
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
          {/* Ticket */}
          <ListItem button component={Link} to="/ticket">
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <ConfirmationNumberIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Ticket" sx={{ color: "#ffffff" }} />
          </ListItem>

          {/* Ticket */}
          <ListItem button component={Link} to="/ticket">
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <ConfirmationNumberIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Ticket" sx={{ color: "#ffffff" }} />
          </ListItem>

          {/* Timesheet */}
          <ListItem button component={Link} to="/timesheet">
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <AccessTimeIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Timesheet" sx={{ color: "#ffffff" }} />
          </ListItem>

          {/* Leave */}
          <ListItem button component={Link} to="/leave">
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <BeachAccessIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="leave" sx={{ color: "#ffffff" }} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarEmployee;
