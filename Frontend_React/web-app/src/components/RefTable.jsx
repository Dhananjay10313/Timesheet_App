import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function EditableTable() {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", status: false },
    { id: 2, name: "Jane Smith", status: true },
    // Add more data rows as needed
  ]);

  const handleCheckboxChange = (index, status) => {
    const updatedData = [...data];
    updatedData[index].status = status;
    setData(updatedData);

    // Display information about the row
    console.log(
      `Row ${index + 1} status changed to ${status ? "active" : "inactive"}`
    );
  };

  return (
    <Table striped bordered hover responsive="xl">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>
              <input
                type="checkbox"
                checked={row.status}
                onChange={(e) => handleCheckboxChange(index, e.target.checked)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default EditableTable;
