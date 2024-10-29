import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../App.css";
import axios from "axios";

function EditableTable() {
  const [data, setData] = useState([
    { ticket_id:0, id: "numa", name: "jdsh", status: "io" },
  ]);

  const storedData = localStorage.getItem("userData");
  const userState = storedData ? JSON.parse(storedData) : null;
  const employee_id = userState["emp_id"];
  const manager_id = userState["manager_id"];

  useEffect(() => {
    const fecthData = async () => {
      axios
        .post("http://localhost:8000/getTicketDataByRefUser", {
          id: employee_id,
        })
        .then((response) => {
          console.log("Tickets ref user: ", response.data);
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

          setData(uniqueData);
        });
    };
    fecthData();
  }, []);

  const handleCheckboxChange = async (index, status) => {
    const updatedData = [...data];

    if (!data[index].status && status && data[index].status !== null) {
      updatedData[index].status = status;
      setData(updatedData);
      axios.post("http://localhost:8000/updateTicketDataToDone", {
        id: data[index].ticket_id,
      });
    }

    await axios.post("http://localhost:8000/addAlert", {
      employee_id: updatedData[index].employee_id,
      alt_type: 3,
      alt_description: `Ticket ID ${updatedData[index].ticket_id} Closed.`,
      status: 0,
    });

    console.log(
      `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
    );
  };

  const columns = [
    { field: "ticket_id", headerName: "Ticket ID", width: 150 },
    { field: "creator_id", headerName: "Created By", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "project_id", headerName: "Project", width: 150 },
    { field: "create_at", headerName: "Created At", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={(e) =>
            handleCheckboxChange(params.row.id, e.target.checked)
          }
        />
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
