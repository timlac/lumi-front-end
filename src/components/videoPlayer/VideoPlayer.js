import React, {useRef, useEffect, useState} from 'react';

const VideoPlayer = ({path, data, setActiveTimestamp}) => {
    const videoRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState(null);

    // Fetch and set video URL
    useEffect(() => {
        if (path) {
            fetch(path)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url); // Set object URL for video
                })
                .catch((error) => console.error("Error loading video:", error));
        }

        // Cleanup: revoke object URL when component unmounts
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [path, videoUrl]);

    const updateGraph = () => {
        const video = videoRef.current;
        if (video && data.length > 0) {
            const currentTime = video.currentTime;
            const closestIndex = data.findIndex((d) => parseFloat(d.Timestamp) >= currentTime);

            if (closestIndex !== -1 && closestIndex > 0) {
                const prevIndex = closestIndex - 1;
                const nextIndex = closestIndex;
                const prevTimestamp = parseFloat(data[prevIndex]?.Timestamp);
                const nextTimestamp = parseFloat(data[nextIndex]?.Timestamp);
                const interpolatedIndex = prevIndex + (currentTime - prevTimestamp) / (nextTimestamp - prevTimestamp);
                setActiveTimestamp(interpolatedIndex);
            } else {
                setActiveTimestamp(currentTime);
            }
        }
        animationFrameRef.current = requestAnimationFrame(updateGraph);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('play', () => animationFrameRef.current = requestAnimationFrame(updateGraph));
            video.addEventListener('pause', () => cancelAnimationFrame(animationFrameRef.current));
            video.addEventListener('ended', () => cancelAnimationFrame(animationFrameRef.current));
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [data]);

    return (
        <div style={{marginTop: '20px'}}>
            <video ref={videoRef} width="20%" height="auto" controls>
                {videoUrl && <source src={path} type="video/mp4"/>}
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
