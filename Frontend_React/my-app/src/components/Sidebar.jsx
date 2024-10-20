import React, {useState} from 'react';
import { Drawer, Box, ListItemText, ListItemIcon, Collapse, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState({ timesheet: false, leave: false, ticket: false });

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
          boxSizing: 'border-box',
          backgroundColor: '#1c1c1e', // Dark background
          color: '#ffffff', // White text color
        },
      }}
    >
      <Box sx={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <List>
          {/* Dashboard */}
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <DashboardIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* Timesheet */}
          <ListItem button onClick={() => handleMenuToggle('timesheet')}>
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <AccessTimeIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Timesheet" />
            {openMenu.timesheet ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenu.timesheet} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/filltimesheet" sx={{ pl: 4 }}>
                <ListItemText primary="Fill Timesheet" sx={{ color: '#ffffff' }} />
              </ListItem>
              <ListItem button component={Link} to="/approvetimesheet" sx={{ pl: 4 }}>
                <ListItemText primary="Approve Timesheet" sx={{ color: '#ffffff' }} />
              </ListItem>
            </List>
          </Collapse>

          {/* Leave */}
          <ListItem button onClick={() => handleMenuToggle('leave')}>
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <BeachAccessIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Leave" />
            {openMenu.leave ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenu.leave} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/leave" sx={{ pl: 4 }}>
                <ListItemText primary="Apply Leave" sx={{ color: '#ffffff' }} />
              </ListItem>
              <ListItem button component={Link} to="/leave-approval" sx={{ pl: 4 }}>
                <ListItemText primary="Leave Approval" sx={{ color: '#ffffff' }} />
              </ListItem>
            </List>
          </Collapse>

          {/* Ticket */}
          <ListItem button onClick={() => handleMenuToggle('ticket')}>
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <ConfirmationNumberIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Ticket" />
            {openMenu.ticket ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenu.ticket} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/ticket" sx={{ pl: 4 }}>
                <ListItemText primary="New Ticket" sx={{ color: '#ffffff' }} />
              </ListItem>
              <ListItem button component={Link} to="/ticket-approval" sx={{ pl: 4 }}>
                <ListItemText primary="Ticket Approval" sx={{ color: '#ffffff' }} />
              </ListItem>
            </List>
          </Collapse>

          {/* Project */}
          <ListItem button component={Link} to="/project">
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <WorkIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Project" sx={{ color: '#ffffff' }}/>
          </ListItem>

          {/* Employee */}
          <ListItem button component={Link} to="/employee">
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <GroupIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Employee" sx={{ color: '#ffffff' }}/>
          </ListItem>

          {/* dashboard */}

          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon sx={{ minWidth: '32px' }}>
              <DashboardIcon sx={{ color: '#ffffff' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#ffffff' }}/>
          </ListItem>

        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
