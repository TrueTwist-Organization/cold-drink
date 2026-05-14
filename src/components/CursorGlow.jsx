import React, { useEffect, useRef } from 'react';
import './CursorGlow.css';

const CursorGlow = () => {
  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef(false);
  const posRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (prefersReducedMotion || isCoarsePointer) return undefined;

    const applyPosition = () => {
      frameRef.current = null;
      const { x, y } = posRef.current;
      const scale = pointerRef.current ? 1.5 : 1;

      if (glowRef.current) {
        glowRef.current.style.left = `${x}px`;
        glowRef.current.style.top = `${y}px`;
        glowRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }

      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
    };

    const queueFrame = () => {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(applyPosition);
      }
    };

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      pointerRef.current = Boolean(el && getComputedStyle(el).cursor === 'pointer');
      queueFrame();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{ left: -200, top: -200 }}
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ left: -200, top: -200 }}
      />
    </>
  );
};

export default CursorGlow;
