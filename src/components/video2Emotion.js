import React, {useState, useEffect} from 'react';
import {Col, Row, Card} from "antd";
import EmotionChart from "./emotionChart/EmotionChart";
import ColumnSelector from "./ColumnSelector";
import VideoPlayer from "./videoPlayer/VideoPlayer";
import ValenceArousalHistogram from "./ValenceArousalHistogram";


// TODO: This component remounts unnecessarily often, create a parent component to handle API calls or something
// TODO: Maybe add a datahandling service

const Video2Emotion = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [data, setData] = useState([]);
    const [activeTimestamp, setActiveTimestamp] = useState(0);
    const [selectedColumns, setSelectedColumns] = useState(["valence"]);
    const [fileNameNoExt, setFileNameNoExt] = useState(null);
    const [valenceArousal, setValenceArousal] = useState(null);


    // Fetch available videos from API on component mount
    useEffect(() => {
        fetch("http://127.0.0.1:5000/video")
            .then(response => response.json())
            .then(data => {
                setSelectedVideo(data.videos[0]); // Set the first video as selected by default
                setFileNameNoExt(data.videos[0].replace(/\.[^/.]+$/, ""));
            })
            .catch(error => console.error("Error fetching videos:", error));
    }, []);

    useEffect(() => {
        if (fileNameNoExt) {
            fetch(`http://127.0.0.1:5000/prediction/${fileNameNoExt}`)
                .then(response => response.json())
                .then(jsonData => {
                    // const smoothData = smoothAndDownSampleData(jsonData, 1, 10);
                    // console.log(smoothData)
                    setData(jsonData); // Directly set JSON data to `data`
                })
                .catch(error => console.error("Error fetching prediction:", error));
        }
    }, [fileNameNoExt]);

    useEffect(() => {
        if (fileNameNoExt) {
            fetch(`http://127.0.0.1:5000/prediction/${fileNameNoExt}/valence_arousal`)
                .then(response => response.json())
                .then(jsonData => {
                    setValenceArousal(jsonData);
                })
                .catch(error => console.error("Error fetching valence arousal:", error));
        }
    }, [fileNameNoExt]);

    // Dynamically get available columns from data excluding locked columns
    const availableColumns = data.length > 0 ? Object.keys(data[0]).filter(col =>
        !["timestamp", "frame", "face_id", "predicted_emotion"].includes(col)
    ) : [];

    return (
        <div className="App">
            <center><h1><i>LUMINANCE</i></h1></center>

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
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Video Player">
                        <VideoPlayer
                            path={`http://127.0.0.1:5000/video/${selectedVideo}`}
                            data={data}
                            setActiveTimestamp={setActiveTimestamp}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Arousal Histogram">
                        <ValenceArousalHistogram data={valenceArousal}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Video2Emotion;
