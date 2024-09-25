import React, { useEffect, useState, useRef } from 'react';
import { Select } from 'antd';  // Ant Design Select
import EmotionChart from './visualizations/EmotionChart';
import Papa from 'papaparse';
import {smoothData} from "./services/smoothing";
// import 'antd/dist/antd.css';  // Ant Design styles

const { Option } = Select;

function App() {
  const [data, setData] = useState([]);
  const [activeTimestamp, setActiveTimestamp] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState(["Valence"]);  // Default columns
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const loadCSV = async () => {
      const response = await fetch('/emotion_predictions_output_left.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, { header: true }).data;

            // Apply smoothing to the parsed data
      const smoothedData = smoothData(parsedData, 20);  // Adjust window size as needed
      setData(smoothedData);
    };

    loadCSV();
  }, []);

  const updateGraph = () => {
    const video = videoRef.current;
    if (video && data.length > 0) {
      const currentTime = video.currentTime;

      const closestIndex = data.findIndex((d) => parseFloat(d.Timestamp) >= currentTime);
      if (closestIndex === -1 || closestIndex === 0) {
        setActiveTimestamp(currentTime);
        return;
      }

      const prevIndex = closestIndex - 1;
      const nextIndex = closestIndex;

      const prevTimestamp = parseFloat(data[prevIndex]?.Timestamp);
      const nextTimestamp = parseFloat(data[nextIndex]?.Timestamp);

      const interpolatedIndex = prevIndex + (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
      setActiveTimestamp(interpolatedIndex);
    }
    animationFrameRef.current = requestAnimationFrame(updateGraph);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('play', () => {
        animationFrameRef.current = requestAnimationFrame(updateGraph);
      });

      video.addEventListener('pause', () => {
        cancelAnimationFrame(animationFrameRef.current);
      });

      video.addEventListener('ended', () => {
        cancelAnimationFrame(animationFrameRef.current);
      });

      video.addEventListener('timeupdate', () => {
        updateGraph();
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [data]);

  // Dynamically get available columns from data excluding locked columns
  const availableColumns = data.length > 0 ? Object.keys(data[0]).filter(col =>
    !["Timestamp", "Frame", "Face_ID", "Predicted_Emotion"].includes(col)
  ) : [];

  return (
    <div className="App">
      <h1>Emotion Visualization</h1>

      {/* Ant Design Multi-Select for Column Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>Select Properties to Visualize:</label>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select columns to visualize"
          defaultValue={selectedColumns}
          onChange={(value) => setSelectedColumns(value)}
        >
          {availableColumns.map((column) => (
            <Option key={column} value={column}>
              {column}
            </Option>
          ))}
        </Select>
      </div>

      {/* Render the chart based on selected columns */}
      {data.length > 0 && (
        <EmotionChart
          data={data}
          activeTimestamp={activeTimestamp}
          selectedColumns={selectedColumns}
        />
      )}

      <div style={{ marginTop: '20px' }}>
        <video
          ref={videoRef}
          width="20%"
          height="auto"
          controls
        >
          <source src="/output_left.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default App;