// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// import "../App.css";
// import axios from "axios";

// function ApproveLeaveTable() {
//   const [data, setData] = useState([{id:"numa",name:"jdsh",status:"io"}]);
//   // const response = axios.post(
//   //   "http://localhost:8000/getTicketDataByUser"
//   //  ,
//   //   {
//   //     "id":1
//   //   })
//   //   console.log(response)

//   useEffect(()=>{
//     axios.post(
//       "http://localhost:8000/getLeaveDataByManager"
//      ,
//       {
//         "id":1 // change by current user
//       }
//     ).then((response)=>{
//       console.log("manger leave",response.data)
//       setData(response.data)
//     });
//   },[])

//   // const handleCheckboxChange = (index, status) => {
//   //   const updatedData = [...data];
    
    
    
    

//   //   if(data[index].status===1 && status && data[index].status!== null){
//   //     updatedData[index].status=status;
//   //     setData(updatedData);
//   //     axios.post("http://localhost:8000/updateLeaveDataToDone",

//   //       {
//   //         "id": data[index].leave_id
//   //       }
//   //     );
//   //   }




//     // Display information about the row
//   //   console.log(
//   //     `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
//   //   );
//   // };




//   const handleAccept = (index) => {
//     const updatedData = [...data];
//     console.log(data[index].leave_id)
//     updatedData[index].status=2
//     setData(updatedData)
//     axios.post("http://localhost:8000/updateLeaveDataToDoneorReject",

//       {
//         "id": data[index].leave_id,
//         "status":2
//       }
//     );
//   };

//   const handleReject = (index) => {
//     const updatedData = [...data];
//     updatedData[index].status=3
//     setData(updatedData)
//     axios.post("http://localhost:8000/updateLeaveDataToDoneorReject",

//       {
//         "id": data[index].leave_id,
//         "status":3
//       }
//     );
//   };


//   return (
//     <Container>
//       <div className="keep-space-bet-components">
//         <span>For You</span>
//       </div>

//       <Table striped bordered hover responsive="xl">
//         <thead>
//           <tr>
//             <th>Leave ID</th>
//             <th>Employee ID</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Reason</th>
//             <th>Type</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{row.leave_id}</td>
//               <td>{row.employee_id}</td>
//               <td>{row.start_date}</td>
//               <td>{row.end_date}</td>
//               <td>{row.reason}</td>
//               <td>{row.t_id===1?"Sick Leave":(row.t_id===2?"Casual Leave":"Paid Leave")}</td>
//               {/* <td>{row.status===1?"Pending":(row.status===2?"Approved":"Rejected")}</td> */}
//               <td>
//               <div>
//         <button disabled={row.status===1?0:1} onClick={()=>handleAccept(index)}>Accept</button>
//         <button disabled={row.status===1?0:1} onClick={()=>handleReject(index)}>Reject</button>
//       </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default ApproveLeaveTable;
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";

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
        console.log("manager leave", response.data);
        setData(response.data);
      });
  }, [employee_id]);

  const handleAccept = async (id) => {
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
            onClick={() => handleAccept(params.row.leave_id)}
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
