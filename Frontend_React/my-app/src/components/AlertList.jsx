import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, List, ListItem, ListItemText, IconButton, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

const AlertList = ({ onClose }) => {
  const [alerts, setAlerts] = useState([
    { description: "No Notifications", alt_type: 4, status:3 }
  ]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async () =>{
        const response = await axios.post("http://localhost:8000/getAlertByEmployee", {
            emp_id: 1, //change with current user
        });
        setAlerts(response.data);
    }
    fetchData()      
  },[])

  useEffect(() => {
    if (alerts.length === 0) {
      onClose();
    }
  }, [alerts, onClose]);

  

  const handleAlertClick = (alert) => {
    switch (alert.alt_type) {
      case 1:
        navigate("/timesheet");
        break;
      case 2:
        navigate("/leave");
        break;
      case 3:
        navigate("/ticket");
        break;
      default:
        break;
    }
  };

  const handleAlertClose = async (index) => {
    console.log("alerts[index].alt_id", alerts[index].alt_id)
    axios.post("http://localhost:8000/updateAlerts", {
        alt_id: alerts[index].alt_id, //change with current user
    });
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
  };

  return (
    <Container>
      <List>
        {alerts.map((alert, index) => (
          <React.Fragment key={index}>
            <ListItem
              button
              onClick={() => handleAlertClick(alert)}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <ListItemText primary={alert.description} />
              {alert.status!=3 && <IconButton
                edge="end"
                aria-label="close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlertClose(index);
                }}
              >
                <CloseIcon />
              </IconButton>}
            </ListItem>
            {index < alerts.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default AlertList;
