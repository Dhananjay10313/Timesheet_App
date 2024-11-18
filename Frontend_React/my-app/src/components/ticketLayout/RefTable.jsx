import React, { useState, useEffect } from "react";
import { Container, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../App.css";
import axios from "axios";

function EditableTable() {
  const [data, setData] = useState([
    {
      ticket_id: 0,
      id: "numa",
      name: "jdsh",
      status: "io",
      closing_comments: "",
    },
  ]);

  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    const fetchData = async () => {
      axios
        .post("http://localhost:8000/getTicketDataByRefUser", {
          id: employee_id,
        })
        .then((response) => {
          //console.log("Tickets ref user: ", response.data);
          const responseData = response.data;

          // Filter unique data
          const uniqueData = [];
          const ids = new Set();
          responseData.forEach((item) => {
            if (!ids.has(item.id)) {
              ids.add(item.id);
              uniqueData.push(item);
            }
          });

          // Initialize closing_comments for each item
          const initializedData = uniqueData.map((item) => ({
            ...item,
            closing_comments: "",
          }));

          //console.log("initializedData", initializedData);
          setData(responseData);
        });
    };
    fetchData();
  }, [employee_id]);

  const handleButtonClick = async (index) => {
    const updatedData = data.map((item) =>
      item.ticket_id === index ? { ...item, status: 1 } : item
    );
    setData(updatedData);
    // console.log("index", index)

    const ticket = data.find((item) => item.ticket_id === index);

    if (ticket) {
      const comment = ticket.closing_comments;
      // console.log("Ticket clicked", ticket.closing_comments)
      if (comment) {
        await axios.post("http://localhost:8000/updateTicketDataToDone", {
          id: ticket.ticket_id,
          closing_comments: comment,
        });

        await axios.post("http://localhost:8000/addAlert", {
          employee_id: ticket.creator_id,
          alt_type: 6,
          alt_description: `Ticket ID ${ticket.ticket_id} Closed with comment: ${comment}`,
          status: 0,
        });

        //console.log(
        //   `Row ${index + 1} status changed to active with comment: ${comment}`
        // );
      }
      //console.log(`Closing comment for ticket ID ${index}: ${comment}`);
    } else {
      console.error(`No ticket found with ticket_id: ${index}`);
    }
  };

  const handleCommentChange = (id, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.ticket_id == id ? { ...item, closing_comments: value } : item
      )
    );
  };

  const handleKeyDown = (ticket_id, event) => {
    if (event.key === ' ') {
      event.preventDefault(); // Prevent the default action of the space bar
      handleCommentChange(ticket_id, event.target.value + ' ');
    }
  };

  const columns = [
    { field: "ticket_id", headerName: "Ticket ID", width: 100 },
    { field: "creator_id", headerName: "Created By", width: 130 },
    { field: "description", headerName: "Description", width: 270 },
    { field: "project_id", headerName: "Project", width: 100 },
    { field: "create_at", headerName: "Created At", width: 130 },
    {
      field: "closing_comments",
      headerName: "Closing Comments",
      width: 250,
      renderCell: (params) =>
        params.row.status == 0 ? (
          <input
            type="text"
            value={params.row.closing_comments || ""}
            style={{width:"250px", marginRight:"0px"}}
            onChange={(e) =>
              handleCommentChange(params.row.ticket_id, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(params.row.ticket_id, e)}
          />
          // <TextField
          //   label="Reason for Leave"
          //   value={params.row.closing_comments || ""}
          //   onChange={(e) => handleCommentChange(params.row.ticket_id, e.target.value)}
          //   fullWidth
          //   margin="normal"
          // />
        ) : (
          <span>{params.row.closing_comments}</span>
        ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleButtonClick(params.row.ticket_id)}
          disabled={params.row.status !== 0}
        >
          Close
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <div className="keep-space-bet-components">
        <h3 style={{ marginTop: "40px" }}>Tickets For You</h3>
      </div>

      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.ticket_id}
        />
      </div>
    </Container>
  );
}

export default EditableTable;





