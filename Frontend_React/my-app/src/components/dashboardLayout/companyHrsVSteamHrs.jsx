// DonutChartCard.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartCard2 = ({ accepted, rejected }) => {
  const total = accepted + rejected;

  // Define the chart data
  const data = {
    labels: ['Company Total Hrs', 'Team Total Hrs'],
    datasets: [
      {
        data: [accepted, rejected],
        backgroundColor: ['#4caf50', '#f44336'], // Colors for accepted and rejected sections
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
        borderWidth: 2,
      },
    ],
  };

  // Define options for the donut chart
  const options = {
    cutout: '70%', // Creates the donut hole effect
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: true, // Show legend for better readability
        position: 'top',
      },
    },
    maintainAspectRatio: false, // Ensures the chart scales properly
  };

  return (
    <Card sx={{ width: 350, height: 260, margin: '0 auto', boxShadow: 4, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ marginBottom: 1 }}>
          Working hours of company: {total}
        </Typography>
        <div style={{ height: '180px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChartCard2;
