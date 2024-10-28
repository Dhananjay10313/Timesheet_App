import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const generateColors = (numRoles) => {
  const colors = [];
  for (let i = 0; i < numRoles; i++) {
    const hue = (i * 360) / numRoles;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const BarChartByRole = ({ data }) => {
  const dates = Object.keys(data);

  const allRoles = Array.from(
    new Set(
      dates.flatMap((date) => Object.keys(data[date]))
    )
  );

  const roleColors = generateColors(allRoles.length);

  const datasets = allRoles.map((role, index) => ({
    label: role,
    data: dates.map((date) => data[date][role] || 0), 
    backgroundColor: roleColors[index],
    hoverBackgroundColor: roleColors[index].replace('50%', '60%'),
  }));
  const chartData = {
    labels: dates, 
    datasets: datasets, 
  };

  const options = {
    plugins: {
      legend: {
        display: true, 
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false, 
      },
      y: {
        beginAtZero: true, 
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
