import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Legend, Tooltip
} from 'recharts';

const EmotionChart = ({data, activeTimestamp, selectedColumns}) => {
    // const closestDataPoint = Math.floor(activeTimestamp);
    // console.log("closest data point: ", closestDataPoint)
    // console.log(data)

    // Dynamically render lines based on selected columns
    const renderLines = () => {
        return selectedColumns.map((column) => (
            <Line
                key={column}
                type="monotone"
                dataKey={column}
                stroke={getColorForColumn(column)}
                dot={false}
                isAnimationActive={false}  // Disable animation for real-time updates
            />
        ));
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="frame"/>
                <YAxis domain={[-1, 1]}/>
                <Tooltip formatter={(value) => value.toFixed(2)}/>
                <Legend/>
                {renderLines()}
                <ReferenceLine
                    x={data[activeTimestamp]?.frame}
                    stroke="orange"
                    label={{value: "Current Time", position: "top", fill: "orange"}}
                    isFront={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Helper function to assign distinct colors for each column
const getColorForColumn = (column) => {
    const hash = [...column].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57", "#a4de6c",
        "#d4a4de", "#8e44ad", "#3498db", "#e74c3c", "#2ecc71"
    ];
    return colors[hash % colors.length];
};

export default EmotionChart;
