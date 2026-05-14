import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTheme } from '../context/PageThemeContext';
import ScrollFramePlayerGSAP from './ScrollFramePlayerGSAP';
import './Hero.css';

const CYCLE_MS = 4500;

const SLIDES = [
  {
    img: '/home1.jpeg', accent: '#8B5CF6', accentRgb: '139,92,246', tagClr: '#D8B4FE',
    glowA: 'rgba(139,92,246,0.46)', glowB: 'rgba(76,29,149,0.20)', bgPos: 'center center',
    pourX: '51%',
    fruits: [
      { id: '1-a', type: 'berry', left: '15%', top: '20%', size: 58, rotate: -14, delay: 0.0 },
      { id: '1-b', type: 'leaf', left: '25%', top: '55%', size: 56, rotate: 18, delay: 0.7 },
      { id: '1-c', type: 'plum', left: '75%', top: '26%', size: 62, rotate: 10, delay: 1.1 },
      { id: '1-d', type: 'berry', left: '69%', top: '66%', size: 42, rotate: -8, delay: 0.4 },
    ],
  },
  {
    img: '/home2.jpeg', accent: '#F97316', accentRgb: '249,115,22', tagClr: '#FDBA74',
    glowA: 'rgba(249,115,22,0.42)', glowB: 'rgba(154,52,18,0.18)', bgPos: 'center center',
    pourX: '50%',
    fruits: [
      { id: '2-a', type: 'orange', left: '17%', top: '22%', size: 72, rotate: -10, delay: 0.1 },
      { id: '2-b', type: 'mango', left: '22%', top: '68%', size: 68, rotate: 8, delay: 0.8 },
      { id: '2-c', type: 'orange', left: '77%', top: '31%', size: 60, rotate: 16, delay: 1.4 },
      { id: '2-d', type: 'leaf', left: '67%', top: '64%', size: 48, rotate: -16, delay: 0.5 },
    ],
  },
  {
    img: '/home3.jpeg', accent: '#22C55E', accentRgb: '34,197,94', tagClr: '#86EFAC',
    glowA: 'rgba(34,197,94,0.38)', glowB: 'rgba(20,83,45,0.18)', bgPos: 'center center',
    pourX: '50%',
    fruits: [
      { id: '3-a', type: 'lime', left: '14%', top: '24%', size: 70, rotate: -14, delay: 0.1 },
      { id: '3-b', type: 'leaf', left: '23%', top: '61%', size: 58, rotate: 22, delay: 0.8 },
      { id: '3-c', type: 'lime', left: '77%', top: '28%', size: 58, rotate: 10, delay: 1.0 },
      { id: '3-d', type: 'leaf', left: '70%', top: '66%', size: 46, rotate: -12, delay: 0.5 },
    ],
  },
  {
    img: '/home4.jpeg', accent: '#EC4899', accentRgb: '236,72,153', tagClr: '#F9A8D4',
    glowA: 'rgba(236,72,153,0.40)', glowB: 'rgba(131,24,67,0.20)', bgPos: 'center center',
    pourX: '52%',
    fruits: [
      { id: '4-a', type: 'berry', left: '16%', top: '20%', size: 64, rotate: -10, delay: 0.1 },
      { id: '4-b', type: 'plum', left: '24%', top: '62%', size: 56, rotate: 12, delay: 0.7 },
      { id: '4-c', type: 'berry', left: '79%', top: '33%', size: 52, rotate: 14, delay: 1.2 },
      { id: '4-d', type: 'leaf', left: '68%', top: '66%', size: 46, rotate: -18, delay: 0.5 },
    ],
  },
];

const HERO_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 11) % 82)}%`,
  top: `${10 + ((i * 17) % 68)}%`,
  size: 4 + ((i * 3) % 10),
  dur: 8 + (i % 4) * 1.4,
  delay: i * 0.35,
}));

const WATER_DROPS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  offset: `${-8 + ((i * 1.2) % 16)}%`,
  size: 5 + ((i * 3) % 12),
  dur: 3.8 + (i % 4) * 1.1,
  delay: i * 0.45,
}));

const Hero = () => {
  const [active, setActive] = useState(0);
  const pinRef = useRef(null);
  const { setTheme } = usePageTheme();

  const handleFrameChange = useCallback((frame) => {
    // 50 frames per sequence
    let newActive = Math.floor(frame / 50);
    if (newActive > 3) newActive = 3; // Clamp
    if (newActive !== active) setActive(newActive);
  }, [active]);

  const frameData = useMemo(() => [
    { path: '/home1 frames', count: 50, prefix: '2160de6f-2b8a-45a0-931e-232dd4257077_', suffix: '.jpg' },
    { path: '/home2 frames', count: 50, prefix: '3d35f60c-b3b3-425d-8007-d58e6063d188_', suffix: '.jpg' },
    { path: '/home3 frames', count: 50, prefix: 'f12af663-dbaf-46a0-99b2-6958c48bc3e1_', suffix: '.jpg' },
    { path: '/home4 frames', count: 50, prefix: 'cde7e153-25b0-4f7f-b91b-5ac4e204d267_', suffix: '.jpg' }
  ], []);

  const cur = SLIDES[active];

  useEffect(() => {
    setTheme(cur);
  }, [cur, setTheme]);

  return (
    <section className="hero hero-gallery" ref={pinRef}>
      <div className="hero-bg" />

      <div className="hero-scroll-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <ScrollFramePlayerGSAP
          frames={frameData}
          pinRef={pinRef}
          scrollSensitivity={40}
          onFrameChange={handleFrameChange}
        />
      </div>

      <motion.div
        className="hero-color-glow"
        animate={{
          background: `radial-gradient(ellipse 86% 76% at 50% 48%, ${cur.glowA} 0%, ${cur.glowB} 48%, transparent 72%)`,
        }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`fruits-${cur.img}`}
          className="hero-fruit-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {cur.fruits.map((fruit) => (
            <span
              key={fruit.id}
              className={`hero-fruit hero-fruit-${fruit.type}`}
              style={{
                left: fruit.left,
                top: fruit.top,
                width: fruit.size,
                height: fruit.size,
                '--fruit-rot': `${fruit.rotate}deg`,
                animationDelay: `${fruit.delay}s`,
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="hero-waterfall" aria-hidden="true">
        <span
          className="hero-water-pour"
          style={{
            left: cur.pourX,
            background: `linear-gradient(180deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.42) 12%,
              rgba(${cur.accentRgb},0.22) 28%,
              rgba(${cur.accentRgb},0.46) 58%,
              rgba(255,255,255,0.12) 84%,
              rgba(255,255,255,0) 100%)`,
            boxShadow: `0 0 18px rgba(${cur.accentRgb},0.20), 0 0 60px rgba(${cur.accentRgb},0.16)`,
          }}
        />
        <span
          className="hero-water-splash"
          style={{
            left: cur.pourX,
            boxShadow: `0 0 26px rgba(${cur.accentRgb},0.24)`,
          }}
        />

        {WATER_DROPS.map((drop) => (
          <span
            key={drop.id}
            className="hero-water-drop"
            style={{
              left: `calc(${cur.pourX} + ${drop.offset})`,
              width: drop.size,
              height: drop.size * 1.5,
              animationDuration: `${drop.dur}s`,
              animationDelay: `${drop.delay}s`,
              background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.85), rgba(${cur.accentRgb},0.44) 58%, rgba(${cur.accentRgb},0.04) 100%)`,
              boxShadow: `0 0 16px rgba(${cur.accentRgb},0.30)`,
            }}
          />
        ))}
      </div>

      <div className="hero-soft-overlay" />

      <div className="hero-gallery-particles" aria-hidden="true">
        {HERO_PARTICLES.map((p) => (
          <span
            key={p.id}
            className="hero-gallery-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Removed static dots for scroll player */}
    </section>
  );
};

export default Hero;
