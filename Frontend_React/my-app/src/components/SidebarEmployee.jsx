import React, { useState } from "react";
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

const Sidebar = ({ isOpen, toggleSidebar }) => {
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

  const menuItems = [
    {
      text: "Ticket",
      icon: <ConfirmationNumberIcon sx={{ color: "#ffffff" }} />,
      link: "/ticket",
    },
    {
        text: "Leave",
        icon: <BeachAccessIcon sx={{ color: "#ffffff" }} />,
        link: "/leave",
      },

      {
        text: "Timesheet",
        icon: <AccessTimeIcon sx={{ color: "#ffffff" }} />,
        link: "/timesheet",
      },
  ];

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
                  item.subItems && handleMenuToggle(item.text.toLowerCase())
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
