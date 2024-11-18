import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, Typography } from '@mui/material';

const GaugeChartCard = ({ companyHours, teamHours }) => {
  const percentage = (teamHours / companyHours) * 100;

  return (
    <Card sx={{ width: 350, height: 260, margin: '0 auto', boxShadow: 4, borderRadius: 0 }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" sx={{ marginBottom: 1 }}>
          Working hours of Department: {companyHours}
        </Typography>
        <div style={{ height: '180px' }}>
          <Plot
            data={[
              {
                type: 'indicator',
                mode: 'gauge+number',
                value: percentage ,
                title: { text: 'Team Working Hours (%) Compared to Department', font: { size: 12 } },
                gauge: {
                  axis: { range: [0, 100], tickwidth: 1, tickcolor: 'darkblue' },
                  bar: { color: 'darkblue' },
                  bgcolor: 'white',
                  borderwidth: 2,
                  bordercolor: 'gray',
                  steps: [
                    { range: [0, 50], color: 'lightgray' },
                    { range: [50, 100], color: 'gray' },
                  ],
                  threshold: {
                    line: { color: 'red', width: 4 },
                    thickness: 0.75,
                    value: percentage,
                  },
                },
              },
            ]}
            layout={{
              width: 300,
              height: 200,
              margin: { t: 20, b: 20, l: 30, r: 30 },
              paper_bgcolor: 'white',
              font: { color: 'darkblue', family: 'Arial' },
            }}
            config={{ displayModeBar: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GaugeChartCard;
