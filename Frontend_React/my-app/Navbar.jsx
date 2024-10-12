import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {

  const handleAlertClick = () => {
    alert("Alert icon clicked!");
  };

  const handleLogoutClick = () => {
    console.log("Logout function triggered!");
  };

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
    </AppBar>
  );
};

export default Navbar;
