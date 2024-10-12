import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import "../App.css";
import axios from "axios";

function upperEditableTable({data}) {
  // const [data, setData] = useState([{id:"numa",name:"jdsh",status:"io"}]);
  // const response = axios.post(
  //   "http://localhost:8000/getTicketDataByUser"
  //  ,
  //   {
  //     "id":1
  //   })
  //   console.log(response)

  // useEffect(()=>{
  //   axios.post(
  //     "http://localhost:8000/getTicketDataByUser"
  //    ,
  //     {
  //       "id":1
  //     }
  //   ).then((response)=>{
  //     console.log(response.data)
  //     setData(response.data)
  //   });
  // },[])

  // const handleCheckboxChange = (index, status) => {
  //   const updatedData = [...data];
    
    
    
    

  //   if(!data[index].status && status && data[index].status!== null){
  //     updatedData[index].status=status;
  //     setData(updatedData);
  //     axios.post("http://localhost:8000/updateTicketDataToDone",

  //       {
  //         "id": data[index].ticket_id
  //       }
  //     );
  //   }

  //   // Display information about the row
  //   console.log(
  //     `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
  //   );
  // };

  return (
    <Container>
      <div className="keep-space-bet-components">
        <span>For You</span>
      </div>

      <Table striped bordered hover responsive="xl">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Created At</th>
            <th>Raised For</th>
            <th>Decription</th>
            <th>Project</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.ticket_id}</td>
              <td>{row.create_at}</td>
              <td>{row.ref_employee_id}</td>
              <td>{row.description}</td>
              <td>{row.project_id}</td>
              <td>{(row.status?"completes":"Pending")}</td>
              
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default upperEditableTable;
