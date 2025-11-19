// src/components/ThemedVideo.js

import React, { useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function ThemedVideo({ sources, style, ...props }) {
  const { colorMode } = useColorMode();
  const TdSource = sources[colorMode] ?? sources.light;
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // If the video is visible, play it
          videoElement.play();
        } 
        // Optional: Pause the video when it scrolls out of view
        // else {
        //   videoElement.pause();
        // }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [TdSource]);

  const handleClick = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.play();
    }
  };

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      style={{ ...style, cursor: 'pointer' }}
      key={TdSource}
      onClick={handleClick}
      {...props}
    >
      <source src={TdSource} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}