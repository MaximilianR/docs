// src/components/ThemedVideo.js

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function ThemedVideo({ sources, style, ...props }) {
  const { colorMode } = useColorMode();
  const TdSource = sources[colorMode] ?? sources.light;

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={style}
      // Use the key to force React to re-render the video when the source changes
      key={TdSource}
      {...props}
    >
      <source src={TdSource} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}
