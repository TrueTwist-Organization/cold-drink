import React, { useState, useEffect, useRef } from 'react';
import { useMotionValueEvent, useMotionValue } from 'framer-motion';
import './ScrollFramePlayer.css';

const ScrollFramePlayer = ({ frames, className, progress: externalProgress }) => {
  const { path, count, prefix, suffix, start = 1 } = frames;
  const [frameIndex, setFrameIndex] = useState(start);
  const containerRef = useRef(null);
  const dummyProgress = useMotionValue(0);

  // Handle framer-motion progress updates
  useMotionValueEvent(externalProgress || dummyProgress, "change", (latest) => {
    if (externalProgress) {
      const index = Math.min(Math.max(Math.floor(latest * (count - 0.001)), 0), count - 1);
      setFrameIndex(start + index);
    }
  });

  useEffect(() => {
    if (externalProgress) return; // Managed by useMotionValueEvent above

    const handleScroll = () => {
      if (!containerRef.current) return;
      const windowHeight = window.innerHeight;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate progress relative to the viewport (Animate-On-Scroll style)
      // Progress = 0 when the top of the element enters the bottom of the screen
      // Progress = 1 when the bottom of the element leaves the top of the screen
      const distance = windowHeight - rect.top;
      const totalScrollRange = windowHeight + rect.height;
      const progress = Math.min(Math.max(distance / totalScrollRange, 0), 1);
      
      const index = Math.min(Math.max(Math.floor(progress * (count - 0.001)), 0), count - 1);
      setFrameIndex(start + index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [count, externalProgress, start]);

  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Preload all images
  useEffect(() => {
    let isMounted = true;
    imagesRef.current = [];

    const loadImages = async () => {
      const chunkSize = 4;
      for (let i = 0; i < count; i += chunkSize) {
        if (!isMounted) break;
        const chunk = [];
        for (let j = 0; j < chunkSize && i + j < count; j++) {
          const imgIndex = i + j;
          const img = new Image();
          const p = new Promise(resolve => {
            img.onload = () => {
              if (imgIndex === 0) drawFrame(0);
              resolve();
            };
            img.onerror = resolve; // Continue on error
          });
          const idx = String(start + imgIndex).padStart(3, '0');
          img.src = `${path}/${prefix}${idx}${suffix}`;
          imagesRef.current[imgIndex] = img;
          chunk.push(p);
        }
        await Promise.all(chunk);
      }
    };

    loadImages();
    return () => { isMounted = false; };
  }, [path, count, prefix, suffix, start]);

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index]) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];
    
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;
    
    // Draw single crisp layer using object-fit: cover math
    ctx.filter = 'none';
    const scale = Math.max(cw / iw, ch / ih);
    const drawX = (cw - iw * scale) / 2;
    const drawY = (ch - ih * scale) / 2;

    ctx.drawImage(img, drawX, drawY, iw * scale, ih * scale);
  };

  useEffect(() => {
    const idx = frameIndex - start;
    drawFrame(Math.max(0, Math.min(idx, count - 1)));
  }, [frameIndex]);

  // Adjust canvas size on mount/resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      drawFrame(frameIndex - start);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [frameIndex, start]);

  return (
    <div ref={containerRef} className={`scroll-frame-container ${className}`}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="scroll-frame-canvas"
      />
    </div>
  );
};

export default ScrollFramePlayer;
