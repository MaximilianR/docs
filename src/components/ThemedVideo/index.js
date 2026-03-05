// src/components/ThemedVideo.js

import React, { useRef, useEffect, useCallback } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function ThemedVideo({
  sources,
  poster,
  style,
  ...props
}) {
  const { colorMode } = useColorMode();
  const src = sources?.[colorMode] ?? sources?.light;
  const videoRef = useRef(null);

  const resolvedPoster =
    typeof poster === 'string'
      ? poster
      : poster
        ? (poster[colorMode] ?? poster.light)
        : undefined;

  const safePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;

    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) safePlay();
        else el.pause();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, safePlay]);

  const handleClick = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    safePlay();
  };

  if (!src) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      key={src}                 // forces reload when theme changes
      muted                    // required for autoplay in most browsers
      playsInline              // important for iOS
      autoPlay                 // signals explicit autoplay intent
      preload="metadata"       // ensures a first frame is available
      poster={resolvedPoster}
      onClick={handleClick}
      style={{ ...style, cursor: 'pointer' }}
      {...props}
    >
      <source src={src} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
}
