import React, {useRef, useEffect, useState} from 'react';

const VideoPlayer = ({path, data, setActiveTimestamp, frameRate = 25}) => {
    const videoRef = useRef(null);
    const animationFrameRef = useRef(null);

    const [videoUrl, setVideoUrl] = useState(null);
    const [duration, setDuration] = useState(0); // Store video duration


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
    }, [path]);

    const updateGraph = () => {
        const video = videoRef.current;
        if (video && data.length > 0 && duration > 0) {
            const currentTime = video.currentTime;
            const index = Math.floor((currentTime / duration) * data.length); // Calculate index based on proportion

            console.log(index)
            setActiveTimestamp(index);
        }
        if (video && !video.paused && !video.ended) {
            animationFrameRef.current = requestAnimationFrame(updateGraph);
        }
        // animationFrameRef.current = requestAnimationFrame(updateGraph);
    };

    useEffect(() => {
        const video = videoRef.current;

        const handleLoadedMetadata = () => {
            setDuration(video.duration); // Set video duration when metadata is loaded
        };

        const handlePlay = () => {
            animationFrameRef.current = requestAnimationFrame(updateGraph);
        };
        const handlePauseOrEnd = () => {
            cancelAnimationFrame(animationFrameRef.current);
        };

        const handleSeeked = () => {
            // Update graph immediately when scrubbing
            updateGraph();
        };

        if (video) {
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePauseOrEnd);
            video.addEventListener('ended', handlePauseOrEnd);
            video.addEventListener('seeked', handleSeeked);
        }

        // Cleanup event listeners on unmount
        return () => {
            if (video) {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePauseOrEnd);
                video.removeEventListener('ended', handlePauseOrEnd);
                video.removeEventListener('seeked', handleSeeked);
            }
            cancelAnimationFrame(animationFrameRef.current); // Cleanup animation frame
        };
    }, [data]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            <video ref={videoRef} controls style={{maxWidth: '100%', maxHeight: '100%'}}>
                {videoUrl && <source src={path} type="video/mp4"/>}
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
