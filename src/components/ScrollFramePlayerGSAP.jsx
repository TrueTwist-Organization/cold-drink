import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 🎬 Premium Apple-Style Scroll Frame Player (GSAP Edition)
 * Optimized for high performance across all devices.
 */
const ScrollFramePlayerGSAP = ({ 
  frames, 
  pinRef, 
  scrubSpeed = 1.0,  // Slightly faster for better responsiveness with lerp
  scrollSensitivity = 80, // Higher = slower/longer scroll distance
  onProgress = () => {},
  onFrameChange = null
}) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const sequence = useRef({ frame: 0 });
  const [loadPercent, setLoadPercent] = useState(0);

  const frameData = useMemo(() => {
    if (!frames) return null;
    
    if (Array.isArray(frames)) {
      return frames.flatMap(f => {
        const { path, count, prefix, suffix, start = 1 } = f;
        return Array.from({ length: count }, (_, i) => {
          const index = (start + i).toString().padStart(3, '0');
          return `${path}/${prefix}${index}${suffix}`;
        });
      });
    }

    const { path, count, prefix, suffix, start = 1 } = frames;
    return Array.from({ length: count }, (_, i) => {
      const index = (start + i).toString().padStart(3, '0');
      return `${path}/${prefix}${index}${suffix}`;
    });
  }, [frames]);

  // ── Preloading Logic ──────────────────────────────────────────
  useEffect(() => {
    if (!frameData) return;

    let isMounted = true;
    let loadedCount = 0;
    const total = frameData.length;
    const loadedImages = [];
    setIsLoaded(false);
    setLoadPercent(0);

    const loadImage = (src, idx) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (!isMounted) return;
          loadedImages[idx] = img;
          loadedCount++;
          const progress = Math.floor((loadedCount / total) * 100);
          setLoadPercent(progress);
          onProgress(progress);
          if (loadedCount === total) {
            setImages(loadedImages);
            setIsLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed frame: ${src}`);
          loadedCount++;
          resolve();
        };
      });
    };

    // Load first frame immediately to show something
    loadImage(frameData[0], 0).then(async () => {
      // Then load the rest sequentially in chunks to avoid blocking the network and freezing the UI
      const chunkSize = 4;
      for (let i = 1; i < frameData.length; i += chunkSize) {
        if (!isMounted) break;
        const chunk = [];
        for (let j = 0; j < chunkSize && i + j < frameData.length; j++) {
          chunk.push(loadImage(frameData[i + j], i + j));
        }
        await Promise.all(chunk);
      }
    });

    return () => { isMounted = false; };
  }, [frameData]);

  // ── Rendering & GSAP Logic ────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false }); // Better perf with alpha false
      const totalFrames = images.length - 1;

      // Ensure first frame is drawn
      const firstFrame = images[0];
      if (firstFrame) {
         // draw once to avoid initial flicker
      }

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        renderFrame(sequence.current.frame);
      };

      const renderFrame = (idx) => {
        const currentIdx = Math.round(idx);
        const frame = images[currentIdx] || images[0]; // fallback
        if (!frame || !context) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = frame.width;
        const ih = frame.height;

        // Draw single crisp layer using object-fit: cover math
        context.filter = 'none';
        const scale = Math.max(cw / iw, ch / ih);
        const drawX = (cw - iw * scale) / 2;
        const drawY = (ch - ih * scale) / 2;

        context.drawImage(frame, drawX, drawY, iw * scale, ih * scale);
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      // 🎯 GSAP Smooth Scroll Setup
      gsap.to(sequence.current, {
        frame: totalFrames,
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${images.length * scrollSensitivity}`, // Controlled via sensitivity
          scrub: scrubSpeed, 
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
             renderFrame(sequence.current.frame);
             if (onFrameChange) onFrameChange(sequence.current.frame);
          }
        }
      });
    }, pinRef);

    return () => ctx.revert();
  }, [isLoaded, images, pinRef, scrubSpeed, scrollSensitivity]);

  return (
    <div className="canvas-wrapper" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 🚀 High-priority Placeholder Image: Shows instantly while sequence loads */}
      <img
        src={frameData ? frameData[0] : ''}
        alt=""
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          display: isLoaded ? 'none' : 'block',
          zIndex: 1,
        }}
      />
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: isLoaded ? 'block' : 'none',
          position: 'relative',
          zIndex: 2,
        }} 
        className="scroll-frame-canvas"
      />
    </div>
  );
};


export default ScrollFramePlayerGSAP;
