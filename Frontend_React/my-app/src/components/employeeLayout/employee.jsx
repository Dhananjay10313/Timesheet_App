import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.post('/getEmployeeInfo', { manager_id: 1 });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Container>
      <div className="keep-space-bet-components">
        <h3 style={{ marginTop: "40px" }}>Employee Information</h3>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Manager ID</TableCell>
              <TableCell>Projects</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.manager_id}</TableCell>
                <TableCell>{employee.projects.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeTable;
