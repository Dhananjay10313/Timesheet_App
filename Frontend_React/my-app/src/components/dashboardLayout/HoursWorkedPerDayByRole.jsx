// BarChartByRole.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Function to generate unique colors for each role
const generateColors = (numRoles) => {
  const colors = [];
  for (let i = 0; i < numRoles; i++) {
    const hue = (i * 360) / numRoles;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const BarChartByRole = ({ data }) => {
  // Extract all unique dates from the input data
  const dates = Object.keys(data);

  // Dynamically extract all unique roles across all dates
  const allRoles = Array.from(
    new Set(
      dates.flatMap((date) => Object.keys(data[date]))
    )
  );

  // Generate unique colors for each role type
  const roleColors = generateColors(allRoles.length);

  // Prepare datasets for each role type, ensuring missing values are handled (i.e., no bars for roles not present on a certain day)
  const datasets = allRoles.map((role, index) => ({
    label: role,
    data: dates.map((date) => data[date][role] || 0), // Use 0 if the role is not present on a particular day
    backgroundColor: roleColors[index],
    hoverBackgroundColor: roleColors[index].replace('50%', '60%'),
  }));

  // Define the chart data
  const chartData = {
    labels: dates, // Dates as the x-axis labels
    datasets: datasets, // One dataset for each role type
  };

  // Define chart options
  const options = {
    plugins: {
      legend: {
        display: true, // Show legend for role types
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false, // Group bars by date, not stacked
      },
      y: {
        beginAtZero: true, // Start y-axis at zero
        title: {
          display: true,
          text: 'Hours Worked',
        },
      },
    },
  };

  return (
    <Card sx={{ width: '600px', height: '400px', margin: '0 auto', boxShadow: 3, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ marginBottom: 2 }}>
          Hours Worked by Role Type
        </Typography>
        <div style={{ height: '300px', width: '500px' }}>
          <Bar data={chartData} options={options} />
        </div>
       </CardContent>
    </Card>
  );
};

export default BarChartByRole;
