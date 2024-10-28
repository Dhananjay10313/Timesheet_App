import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (numProjects) => {
  const colors = [];
  for (let i = 0; i < numProjects; i++) {
    const hue = (i * 360) / numProjects; 
    colors.push(`hsl(${hue}, 70%, 50%)`); 
  }
  return colors;
};

const PieChartCard = ({ data }) => {
  const projects = Object.keys(data);
  const hours = Object.values(data);

  const backgroundColors = generateColors(projects.length);
  const hoverBackgroundColors = generateColors(projects.length).map((color) =>
    color.replace('50%', '60%')
  );

  const chartData = {
    labels: projects,
    datasets: [
      {
        data: hours,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 2,
      },
    ],
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
  };

  return (
    <Card sx={{ width: 350, height: 260, margin: '0 auto', boxShadow: 4, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ fontSize: '14px', marginBottom: 1 }}>
          Hours Worked By Project
        </Typography>
        <div style={{ height: '200px', width: '230px', margin: '0 auto' }}>
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
