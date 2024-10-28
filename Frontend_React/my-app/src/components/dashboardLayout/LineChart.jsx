import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = ({ data }) => {
  const dates = Object.keys(data);
  const hours = Object.values(data);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Hours Worked',
        data: hours,
        borderColor: '#3b82f6', 
        backgroundColor: 'rgba(59, 130, 246, 0.2)', 
        pointBackgroundColor: '#3b82f6',
        fill: true, 
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Hours Worked',
        },
        beginAtZero: true, 
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card sx={{ width: '600px', height: '400px', margin: '0 auto', boxShadow: 3, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ marginBottom: 2 }}>
          Hours Worked per Day
        </Typography>
    <div style={{ height: '300px', width: '500px' }}>
      <Line data={chartData} options={options} />
    </div>
       </CardContent>
    </Card>
  );
};

export default LineChart;
