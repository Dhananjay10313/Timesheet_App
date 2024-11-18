import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Popover,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AlertList from "./AlertList";
import { useAuth } from "./provider/authProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const Navbar = ({ Authenticate, toggleSidebar }) => {
  const { setUserState } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAlertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    Authenticate();
    setUserState(null);
    // <Navigate to={"/login"}/>
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        height: "64px",
        justifyContent: "center",
        backgroundColor: "#212121",
      }}
    >
      <Toolbar>
        {/* Toggle Button for Sidebar */}
        <IconButton
          color="inherit"
          onClick={toggleSidebar} // Call the function to toggle sidebar
          edge="start"
          sx={{ marginRight: 2, color: "#f5f5f5" }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#f5f5f5" }}
        >
          Rockwell Automation
        </Typography>
        <Box sx={{ display: "flex" }}>
          <IconButton
            color="inherit"
            onClick={handleAlertClick}
            sx={{ color: "#f5f5f5", "&:hover": { color: "#bdbdbd" } }}
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleLogoutClick}
            sx={{ color: "#f5f5f5", "&:hover": { color: "#bdbdbd" } }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <AlertList onClose={handlePopoverClose} />
      </Popover>
    </AppBar>
  );
};

export default Navbar;
