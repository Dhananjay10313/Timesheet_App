import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Popover } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AlertList from "./AlertList"; // Make sure to import your AlertList component
import { useAuth } from "./provider/authProvider"; // Adjust the import according to your project structure

const Navbar = ({ Authenticate }) => {
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
    localStorage.removeItem("token");
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar
      position="fixed"
      sx={{ 
        zIndex: 1201, 
        height: '64px', 
        justifyContent: 'center', 
        backgroundColor: '#212121' // Black background
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#f5f5f5' }}>
          My Dashboard
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <IconButton color="inherit" onClick={handleAlertClick} sx={{ color: '#f5f5f5', '&:hover': { color: '#bdbdbd' } }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogoutClick} sx={{ color: '#f5f5f5', '&:hover': { color: '#bdbdbd' } }}>
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <AlertList onClose={handlePopoverClose} />
      </Popover>
    </AppBar>
  );
};

export default Navbar;
