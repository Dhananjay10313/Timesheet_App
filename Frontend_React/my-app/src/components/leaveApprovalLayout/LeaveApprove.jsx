
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

function ApproveLeaveTable() {
  const [data, setData] = useState([]);
  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    axios
      .post("http://localhost:8000/getLeaveDataByManager", {
        id: employee_id, // Change by current user
      })
      .then((response) => {
        //console.log("manager leave", response.data);
        setData(response.data);
      });
  }, [employee_id]);

  const handleAccept = async (id,startDate,endDate,employee_id1,type) => {
    // console.log("here")
    const updatedData = data.map((item) =>
      item.leave_id === id ? { ...item, status: 2 } : item
    );
    setData(updatedData);
    await axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id,
      status: 2,
    });

    const leave = updatedData.find((item) => item.leave_id === id);
    await axios.post("http://localhost:8000/addAlert", {
      employee_id: leave.employee_id,
      alt_type: 2,
      alt_description: `Leave ID ${leave.leave_id} Approved`,
      status: 0,
    });

    const daysRequested = dayjs(endDate).diff(dayjs(startDate), 'day')+1;
    //console.log("DaysRequested", daysRequested)
    await axios.post("http://localhost:8000/updateRemainingLeaves", {
      emp_id: employee_id1,
      t_id: type,
      days: parseInt(daysRequested),
    });


  };

  const handleReject = async (id) => {
    const updatedData = data.map((item) =>
      item.leave_id === id ? { ...item, status: 3 } : item
    );
    setData(updatedData);
    await axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id,
      status: 3,
    });

    const leave = updatedData.find((item) => item.leave_id === id);
    await axios.post("http://localhost:8000/addAlert", {
      employee_id: leave.employee_id,
      alt_type: 2,
      alt_description: `Leave ID ${leave.leave_id} Rejected`,
      status: 0,
    });
  };

  const columns = [
    // { field: "leave_id", headerName: "Leave ID", width: 100 },
    { field: "employee_id", headerName: "Employee ID", width: 150 },
    { field: "start_date", headerName: "Start Date", width: 150 },
    { field: "end_date", headerName: "End Date", width: 150 },
    { field: "reason", headerName: "Reason", width: 230 },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      renderCell: (params) => (
        <>{params.row.type==1?"Sick":(params.row.type==2?"Casual":"Paid")}</>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <>{params.row.status==1?"Pending":(params.row.status==2?"Accepted":"Rejected")}</>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 280,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAccept(params.row.leave_id, params.row.start_date, params.row.end_date, params.row.employee_id, params.row.type)}
            disabled={params.row.status !== 1}
            style={{ marginRight: "10px" }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleReject(params.row.leave_id)}
            disabled={params.row.status !== 1}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: "100%", marginTop: "40px" }}>
      <h3>Leave Approval List</h3>
      <DataGrid rows={data} columns={columns} getRowId={(row) => row.leave_id} />
    </div>
  );
}

export default ApproveLeaveTable;
