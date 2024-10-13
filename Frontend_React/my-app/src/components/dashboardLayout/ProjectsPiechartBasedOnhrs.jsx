// PieChartCard.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate unique colors for each project
const generateColors = (numProjects) => {
  const colors = [];
  for (let i = 0; i < numProjects; i++) {
    const hue = (i * 360) / numProjects; // Evenly distribute hues around the color wheel
    colors.push(`hsl(${hue}, 70%, 50%)`); // Saturation and lightness constants for vibrant colors
  }
  return colors;
};

const PieChartCard = ({ data }) => {
  // Extract the project names and hours from the data object
  const projects = Object.keys(data);
  const hours = Object.values(data);

  // Generate unique colors for each project
  const backgroundColors = generateColors(projects.length);
  const hoverBackgroundColors = generateColors(projects.length).map((color) =>
    color.replace('50%', '60%') // Slightly lighter for hover effect
  );

  // Define the chart data
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

  // Define chart options
  const options = {
    plugins: {
      legend: {
        display: true, // Show legend for each project
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false, // Allow chart to adapt to card size
  };

  return (
    <Card sx={{ width: 350, height: 260, margin: '0 auto', boxShadow: 4, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ fontSize: '14px', marginBottom: 1 }}>
          Hours Worked
        </Typography>
        <div style={{ height: '200px', width: '230px', margin: '0 auto' }}>
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
