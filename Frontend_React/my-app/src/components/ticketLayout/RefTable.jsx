// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// import "../App.css";
// import axios from "axios";

// function EditableTable() {
//   const [data, setData] = useState([
//     { id: "numa", name: "jdsh", status: "io" },
//   ]);
//   // const response = axios.post(
//   //   "http://localhost:8000/getTicketDataByUser"
//   //  ,
//   //   {
//   //     "id":1
//   //   })
//   //   console.log(response)

//   useEffect(() => {
//     axios
//       .post("http://localhost:8000/getTicketDataByRefUser", {
//         id: 1,
//       })
//       .then((response) => {
//         console.log(response.data);
//         setData(response.data);
//       });
//   }, []);

//   const handleCheckboxChange = (index, status) => {
//     const updatedData = [...data];

//     if (!data[index].status && status && data[index].status !== null) {
//       updatedData[index].status = status;
//       setData(updatedData);
//       axios.post(
//         "http://localhost:8000/updateTicketDataToDone",

//         {
//           id: data[index].ticket_id,
//         }
//       );
//     }

//     // Display information about the row
//     console.log(
//       `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
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
//             <th>Ticket ID</th>
//             <th>Created By</th>
//             <th>Decription</th>
//             <th>Project</th>
//             <th>Created At</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               <td>{row.ticket_id}</td>
//               <td>{row.creator_id}</td>
//               <td>{row.description}</td>
//               <td>{row.project_id}</td>
//               <td>{row.create_at}</td>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={row.status}
//                   onChange={(e) =>
//                     handleCheckboxChange(index, e.target.checked)
//                   }
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default EditableTable;



import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import "../App.css";
import axios from "axios";

function EditableTable() {
  const [data, setData] = useState([
    { id: "numa", name: "jdsh", status: "io" },
  ]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/getTicketDataByRefUser", {
        id: 1,
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      });
  }, []);

  const handleCheckboxChange = async (index, status) => {
    const updatedData = [...data];

    if (!data[index].status && status && data[index].status !== null) {
      updatedData[index].status = status;
      setData(updatedData);
      axios.post(
        "http://localhost:8000/updateTicketDataToDone",
        {
          id: data[index].ticket_id,
        }
      );
    }

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: updatedData[index].employee_id,
      alt_type: 3,
      alt_description: `Ticket ID ${updatedData[index].ticket_id} Closed.`,
      status: 0
    });

    // Display information about the row
    console.log(
      `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
    );
  };

  return (
    <Container>
      <div className="keep-space-bet-components">
        <h3 style={{ marginTop: "40px" }}> Close Tickets</h3>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ticket_id}</TableCell>
                <TableCell>{row.creator_id}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.project_id}</TableCell>
                <TableCell>{row.create_at}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={row.status}
                    onChange={(e) =>
                      handleCheckboxChange(index, e.target.checked)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default EditableTable;

