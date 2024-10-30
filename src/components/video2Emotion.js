import React, {useState, useEffect} from 'react';
import EmotionChart from "./emotionChart/EmotionChart";
import DataLoader from "./DataLoader";
import ColumnSelector from "./ColumnSelector";
import VideoPlayer from "./videoPlayer/VideoPlayer";
import {smoothAndDownSampleData} from "../services/smoothing";

const Video2Emotion = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [data, setData] = useState([]);
    const [activeTimestamp, setActiveTimestamp] = useState(0);
    const [selectedColumns, setSelectedColumns] = useState(["Valence"]);

    // Fetch available videos from API on component mount
    useEffect(() => {
        fetch("http://127.0.0.1:5000/video")
            .then(response => response.json())
            .then(data => {
                setSelectedVideo(data.videos[0]); // Set the first video as selected by default
            })
            .catch(error => console.error("Error fetching videos:", error));
    }, []);

    useEffect(() => {
        if (selectedVideo) {
            console.log(selectedVideo)

            const fileNameNoExt = selectedVideo.replace(/\.[^/.]+$/, "");

            console.log(fileNameNoExt)

            fetch(`http://127.0.0.1:5000/prediction/${fileNameNoExt}`)
                .then(response => response.json())
                .then(jsonData => {
                    const smoothData = smoothAndDownSampleData(jsonData, 1, 10);
                    console.log(smoothData)
                    setData(smoothData); // Directly set JSON data to `data`
                })
                .catch(error => console.error("Error fetching prediction:", error));
        }
    }, [selectedVideo]);


    // Dynamically get available columns from data excluding locked columns
    const availableColumns = data.length > 0 ? Object.keys(data[0]).filter(col =>
        !["Timestamp", "Frame", "Face_ID", "Predicted_Emotion"].includes(col)
    ) : [];

    return (
        <div className="App">
            <center><h1><i>LUMINANCE</i></h1></center>

            {/* Load and process CSV data */}
            {/*<DataLoader path={predctionsUrl} setData={setData}/>*/}

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
                path={`http://127.0.0.1:5000/video/${selectedVideo}`}
                data={data}
                setActiveTimestamp={setActiveTimestamp}
            />
        </div>
    );
};

export default Video2Emotion;
