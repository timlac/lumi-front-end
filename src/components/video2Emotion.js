import React, { useState } from 'react';
import EmotionChart from "./emotionChart/EmotionChart";
import DataLoader from "./DataLoader";
import ColumnSelector from "./ColumnSelector";
import VideoPlayer from "./videoPlayer/VideoPlayer";


const Video2Emotion = () => {
  const [predictionsPath] = useState('/analytics/KOSMOS020_RMW_BAS_LEFT.csv');
  const [videoPath] = useState('/videos/.sensitive_data/kosmos/split/KOSMOS020_RMW_BAS_LEFT.mp4');

  const [data, setData] = useState([]);
  const [activeTimestamp, setActiveTimestamp] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState(["Valence"]);

  // Dynamically get available columns from data excluding locked columns
  const availableColumns = data.length > 0 ? Object.keys(data[0]).filter(col =>
    !["Timestamp", "Frame", "Face_ID", "Predicted_Emotion"].includes(col)
  ) : [];

  return (
    <div className="App">
      <center><h1><i>LUMINANCE</i></h1></center>

      {/* Load and process CSV data */}
      <DataLoader path={predictionsPath} setData={setData} />

      {/* Column selector for choosing properties */}
      <ColumnSelector
        availableColumns={availableColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />

      {/* Render the chart based on selected columns */}
      {data.length > 0 && (
        <EmotionChart
          data={data}
          activeTimestamp={activeTimestamp}
          selectedColumns={selectedColumns}
        />
      )}

      {/* Video player to sync with chart */}
      <VideoPlayer
        path={videoPath}
        data={data}
        setActiveTimestamp={setActiveTimestamp}
      />
    </div>
  );
};

export default Video2Emotion;
