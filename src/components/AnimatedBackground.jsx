import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { usePageTheme } from '../context/PageThemeContext';
import './AnimatedBackground.css';

/* ── Seeded deterministic RNG ─────────────────────────── */
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s-1)/2147483646; };
}

const FRUITS = (() => {
  const r = seededRand(42);
  return Array.from({ length: 22 }, (_, i) => ({
    id:    i,
    type:  i % 5,
    left:  `${r()*90+2}%`,
    top:   `${r()*85+2}%`,
    size:  r()*38+18,
    dur:   r()*6+4,
    delay: r()*-12,
    rot:   r()*360,
    opacity: r()*0.28+0.1,
  }));
})();

const BUBBLES = (() => {
  const r = seededRand(77);
  return Array.from({ length: 18 }, (_, i) => ({
    id:    i,
    size:  r()*12+4,
    left:  `${r()*94+2}%`,
    dur:   r()*8+5,
    delay: r()*14,
    type:  i % 4,
  }));
})();

const BLOB_LAYOUT = [
  { width:500, height:500, top:-140, left:-120, opacity:0.85 },
  { width:450, height:450, bottom:-100, right:-80, top:'auto', left:'auto', opacity:0.70 },
  { width:380, height:380, top:'28%', right:'6%', left:'auto', opacity:0.55 },
  { width:340, height:340, top:'55%', left:'10%', opacity:0.45 },
];

/* ── Scroll breakpoints for each background image ───────
   The page is divided into thirds:
   img1 → hero + first scroll (0-40%)
   img2 → mid page (25-72%)
   img3 → lower page (60-100%)                          */
const IMG1_RANGE  = [0,   0.05, 0.35, 0.48];
const IMG1_OPAC   = [1,   1,    0.70, 0   ];
const IMG2_RANGE  = [0.22, 0.38, 0.58, 0.74];
const IMG2_OPAC   = [0,   0.82, 0.82, 0  ];
const IMG3_RANGE  = [0.58, 0.72, 1   ];
const IMG3_OPAC   = [0,   0.78, 0.85];

const AnimatedBackground = () => {
  const { theme } = usePageTheme();

  /* ── Full-page scroll progress ─────────────────────── */
  const { scrollYProgress } = useScroll();

  const raw1 = useTransform(scrollYProgress, IMG1_RANGE, IMG1_OPAC);
  const raw2 = useTransform(scrollYProgress, IMG2_RANGE, IMG2_OPAC);
  const raw3 = useTransform(scrollYProgress, IMG3_RANGE, IMG3_OPAC);

  /* Springs smooth out the crossfade on scroll */
  const op1 = useSpring(raw1, { stiffness:32, damping:20 });
  const op2 = useSpring(raw2, { stiffness:32, damping:20 });
  const op3 = useSpring(raw3, { stiffness:32, damping:20 });

  const blobColors = [
    `radial-gradient(circle, rgba(${theme.accentRgb},0.32) 0%, rgba(${theme.accentRgb},0.08) 55%, transparent 75%)`,
    `radial-gradient(circle, rgba(${theme.accentRgb},0.24) 0%, rgba(${theme.accentRgb},0.05) 55%, transparent 75%)`,
    `radial-gradient(circle, rgba(${theme.accentRgb},0.18) 0%, rgba(${theme.accentRgb},0.04) 55%, transparent 75%)`,
    `radial-gradient(circle, rgba(${theme.accentRgb},0.14) 0%, rgba(${theme.accentRgb},0.04) 55%, transparent 75%)`,
  ];

  return (
    <div className="animated-bg-container">

      {/* ══ SCROLL-DRIVEN BACKGROUND IMAGES ══════════════
          All three are position:fixed so they cover the
          entire viewport as the user scrolls the page.
          Springs make the crossfade smooth on scroll.    */}
      <motion.div
        className="bg-scroll-img bg-scroll-img-1"
        style={{ opacity: op1 }}
      />
      <motion.div
        className="bg-scroll-img bg-scroll-img-2"
        style={{ opacity: op2 }}
      />
      <motion.div
        className="bg-scroll-img bg-scroll-img-3"
        style={{ opacity: op3 }}
      />

      {/* Dark gradient base (always on top of images) */}
      <div className="bg-gradient-base" />

      {/* Page-wide color wash — matches active bottle */}
      <motion.div
        className="bg-page-wash"
        animate={{
          background: `
            radial-gradient(ellipse 80% 65% at 70% 45%,
              rgba(${theme.accentRgb},0.14) 0%,
              rgba(${theme.accentRgb},0.05) 50%,
              transparent 72%
            ),
            radial-gradient(ellipse 60% 60% at 15% 80%,
              rgba(${theme.accentRgb},0.09) 0%,
              transparent 60%
            )
          `,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* Animated ambient blobs */}
      {BLOB_LAYOUT.map((pos, i) => (
        <motion.div
          key={i}
          className="bg-blob-dyn"
          style={{
            width:  pos.width,
            height: pos.height,
            top:    pos.top    ?? 'auto',
            left:   pos.left   ?? 'auto',
            bottom: pos.bottom ?? 'auto',
            right:  pos.right  ?? 'auto',
            opacity: pos.opacity,
          }}
          animate={{ background: blobColors[i] }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating fruit shapes */}
      {FRUITS.map(f => (
        <div
          key={`f${f.id}`}
          className={`bg-fruit fruit-t${f.type}`}
          style={{
            left:    f.left,
            top:     f.top,
            width:   f.size,
            height:  f.size,
            opacity: f.opacity,
            '--rot': `${f.rot}deg`,
            animationDuration: `${f.dur}s`,
            animationDelay:    `${f.delay}s`,
          }}
        />
      ))}

      {/* Rising bubbles */}
      {BUBBLES.map(b => (
        <div
          key={`b${b.id}`}
          className={`bg-soft-bubble bub-t${b.type}`}
          style={{
            width:  b.size,
            height: b.size,
            left:   b.left,
            animationDuration: `${b.dur}s`,
            animationDelay:    `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
