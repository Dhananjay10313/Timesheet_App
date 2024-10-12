import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';

const Sidebar = () => {
  const location = useLocation(); // To highlight the active route
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Timesheet", icon: <AccessTimeIcon />, path: "/timesheet" },
    { label: "Leave", icon: <BeachAccessIcon />, path: "/leave" },
    { label: "Ticket", icon: <ConfirmationNumberIcon />, path: "/ticket" },
    { label: "Project", icon: <WorkIcon />, path: "/project" },
    { label: "Employee", icon: <GroupIcon />, path: "/employee" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px', // Matches Navbar height
          backgroundColor: '#1c1c1e', // Sleek dark background
          color: '#ffffff', // White text color by default
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: location.pathname === item.path ? '#282828' : 'transparent',
                  '&:hover': { backgroundColor: '#e6e6e6', color: '#000000' }, // Black text on hover
                  '& .MuiListItemIcon-root': {
                    color: location.pathname === item.path ? '#ffffff' : '#bdbdbd', // Active icon color
                  },
                  '&:hover .MuiListItemIcon-root': { color: '#000000' } // Black icon color on hover
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: location.pathname === item.path ? '#ffffff' : '#ffffff', // Default white text
                    '&:hover': { color: '#000000' }, // Change text color to black on hover
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    fontSize: '1rem',
                  }}
                />
              </ListItem>
              {index < menuItems.length - 1 && <Divider sx={{ backgroundColor: '#404040' }} />} {/* Divider */}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
