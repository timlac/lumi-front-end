import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Legend, Tooltip
} from 'recharts';

const EmotionChart = ({ data, activeTimestamp, selectedColumns }) => {
  const closestDataPoint = Math.floor(activeTimestamp);  // Get closest point based on timestamp

  const renderLines = () => {
    return selectedColumns.map((column) => (
      <Line
        key={column}
        type="monotone"
        dataKey={column}
        stroke={getColorForColumn(column)}  // Use different colors for each line
        dot={false}
      />
    ));
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Timestamp" />
        <YAxis domain={[-1, 1]} />
        <Tooltip />
        <Legend />
        {renderLines()}
        <ReferenceLine
          x={data[closestDataPoint]?.Timestamp}
          stroke="orange"
          label="Current Time"
          isFront={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Function to assign a different color for each column using a hash function
const getColorForColumn = (column) => {
  const hash = [...column].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57", "#a4de6c",
    "#d4a4de", "#8e44ad", "#3498db", "#e74c3c", "#2ecc71"
  ];
  return colors[hash % colors.length];
};

export default EmotionChart;