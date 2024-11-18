import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartCard = ({ accepted, rejected, received }) => {
  const total = received;

  const data = {
    labels: ['Accepted', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [accepted, rejected, received-accepted-rejected],
        backgroundColor: ['#4caf50', '#f44336', '#1a75ff'], 
        hoverBackgroundColor: ['#66bb6a', '#e57373', '#4d94ff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: '70%', 
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
        display: true, 
        position: 'top',
      },
    },
    maintainAspectRatio: false, 
  };

  return (
    <Card sx={{ width: 350, height: 260, margin: '0 auto', boxShadow: 4, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ marginBottom: 1 }}>
          Total Timesheets: {total}
        </Typography>
        <div style={{ height: '180px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChartCard;