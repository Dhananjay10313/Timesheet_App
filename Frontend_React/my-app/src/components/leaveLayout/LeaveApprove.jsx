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
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

function ApproveLeaveTable() {
  const [data, setData] = useState([{ id: "numa", name: "jdsh", status: "io" }]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/getLeaveDataByManager", {
        id: 1, // Change by current user
      })
      .then((response) => {
        console.log("manager leave", response.data);
        setData(response.data);
      });
  }, []);

  const handleAccept = async (index) => {
    const updatedData = [...data];
    updatedData[index].status = 2;
    setData(updatedData);
    await axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id: data[index].leave_id,
      status: 2,
    });

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: updatedData[index].employee_id,
      alt_type: 2,
      alt_description: `Leave ID ${updatedData[index].leave_id} Approved`,
      status: 0
    });
  };

  const handleReject = async (index) => {
    const updatedData = [...data];
    updatedData[index].status = 3;
    setData(updatedData);
    await axios.post("http://localhost:8000/updateLeaveDataToDoneorReject", {
      id: data[index].leave_id,
      status: 3,
    });

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: updatedData[index].employee_id,
      alt_type: 2,
      alt_description: `Leave ID ${updatedData[index].leave_id} Rejected`,
      status: 0
    });
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Leave Approval List</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.leave_id}</TableCell>
                <TableCell>{row.employee_id}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  {row.t_id === 1
                    ? "Sick Leave"
                    : row.t_id === 2
                    ? "Casual Leave"
                    : "Paid Leave"}
                </TableCell>
                <TableCell>
                  {row.status === 1
                    ? "Pending"
                    : row.status === 2
                    ? "Approved"
                    : "Rejected"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAccept(index)}
                    disabled={row.status !== 1}
                    style={{ marginRight: "10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(index)}
                    disabled={row.status !== 1}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ApproveLeaveTable;
