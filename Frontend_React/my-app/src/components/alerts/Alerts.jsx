import React from 'react';

function AlertList() {
    
  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.alt_id}>
          <p>Alert ID: {alert.alt_id}</p>
          <p>Alert Name: {alert.alert_name}</p>
          <p>Employee ID: {alert.employee_id}</p>
          <p>Status: {alert.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AlertList;