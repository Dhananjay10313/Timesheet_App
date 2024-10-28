// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// import "../App.css";
// import axios from "axios";

// function LeaveEditableTable({data}) {
//   // const [data, setData] = useState([{id:"numa",name:"jdsh",status:"io"}]);
//   // const response = axios.post(
//   //   "http://localhost:8000/getTicketDataByUser"
//   //  ,
//   //   {
//   //     "id":1
//   //   })
//   //   console.log(response)

//   // useEffect(()=>{
//   //   axios.post(
//   //     "http://localhost:8000/getTicketDataByUser"
//   //    ,
//   //     {
//   //       "id":1
//   //     }
//   //   ).then((response)=>{
//   //     console.log(response.data)
//   //     setData(response.data)
//   //   });
//   // },[])

//   // const handleCheckboxChange = (index, status) => {
//   //   const updatedData = [...data];
    
    
    
    

//   //   if(!data[index].status && status && data[index].status!== null){
//   //     updatedData[index].status=status;
//   //     setData(updatedData);
//   //     axios.post("http://localhost:8000/updateTicketDataToDone",

//   //       {
//   //         "id": data[index].ticket_id
//   //       }
//   //     );
//   //   }

//   //   // Display information about the row
//   //   console.log(
//   //     `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
//   //   );
//   // };

//   return (
//     <Container>
//       <div className="keep-space-bet-components">
//         <span>For You</span>
//       </div>

//       <Table striped bordered hover responsive="xl">
//         <thead>
//           <tr>
//             <th>Leave ID</th>
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
//               <td>{row.start_date}</td>
//               <td>{row.end_date}</td>
//               <td>{row.reason}</td>
//               <td>{row.t_id===1?"Sick Leave":(row.t_id===2?"Casual Leave":"Paid Leave")}</td>
//               <td>{row.status===1?"Pending":(row.status===2?"Approved":"Rejected")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default LeaveEditableTable;

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "react-bootstrap";

function LeaveEditableTable({ data }) {
  const columns = [
    { field: "leave_id", headerName: "Leave ID", width: 230 },
    { field: "start_date", headerName: "Start Date", width: 200 },
    { field: "end_date", headerName: "End Date", width: 200 },
    { field: "reason", headerName: "Reason", width: 250 },
    {
      field: "t_id",
      headerName: "Type",
      width: 200,
      renderCell: (params) =>
        params.row.t_id === 1
          ? "Sick Leave"
          : params.row.t_id === 2
          ? "Casual Leave"
          : "Paid Leave",
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) =>
        params.row.status === 1
          ? "Pending"
          : params.row.status === 2
          ? "Approved"
          : "Rejected",
    },
  ];

  return (
    <Container style={{ height: "auto", width: "auto", marginTop: "40px" }}>
      <h3>Your Leave Requests</h3>
      <DataGrid rows={data} columns={columns} getRowId={(row) => row.leave_id} />
    </Container>
  );
}

export default LeaveEditableTable;
