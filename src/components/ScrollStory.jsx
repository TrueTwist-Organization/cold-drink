import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageTheme } from '../context/PageThemeContext';
import './ScrollStory.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Stage captions ──────────────────────────────────── */
const STAGES = [
  { title: 'Pure at Rest',       sub: 'Cold-pressed. Nothing added.',        bg: '#0a0a12' },
  { title: 'In Motion',          sub: 'Every sip starts with movement.',      bg: '#0d1018' },
  { title: 'Released',           sub: 'Nature, unlocked in every drop.',      bg: '#0c1208' },
  { title: 'Full Bloom',         sub: 'Flavor at its absolute peak.',         bg: '#160a00' },
  { title: 'Perfectly Crafted',  sub: 'The finest fruit. The finest drink.',  bg: '#08080f' },
];

/* ── Floating orbit fruits ───────────────────────────── */
const ORBIT_FRUITS = [
  { cls: 'hf-orange', w: 64, orbit: 200, angle:  20, delay: 0,    dur: 9  },
  { cls: 'hf-lemon',  w: 52, orbit: 240, angle: 100, delay: 1.2,  dur: 11 },
  { cls: 'hf-berry',  w: 44, orbit: 180, angle: 200, delay: 0.6,  dur: 7  },
  { cls: 'hf-leaf',   w: 58, orbit: 260, angle: 290, delay: 1.8,  dur: 13 },
  { cls: 'hf-grape',  w: 48, orbit: 210, angle: 155, delay: 0.3,  dur: 10 },
  { cls: 'hf-orange', w: 38, orbit: 290, angle: 330, delay: 2.1,  dur: 12 },
  { cls: 'hf-lemon',  w: 34, orbit: 170, angle:  75, delay: 0.9,  dur: 8  },
  { cls: 'hf-berry',  w: 30, orbit: 310, angle: 240, delay: 1.5,  dur: 14 },
];

/* ── Splash droplets (frozen in scroll time) ─────────── */
const DROPLETS = [
  { w:14, x:'-38%', y:'-55%', angle: 320 }, { w:10, x:'42%',  y:'-62%', angle: 40  },
  { w:8,  x:'-55%', y:'-20%', angle: 210 }, { w:12, x:'60%',  y:'-30%', angle: 150 },
  { w:6,  x:'-30%', y:'-75%', angle: 260 }, { w:16, x:'25%',  y:'-80%', angle: 80  },
  { w:9,  x:'-65%', y: '10%', angle: 190 }, { w:7,  x:'68%',  y:'-10%', angle: 350 },
  { w:11, x:'-20%', y:'-90%', angle:  15 }, { w:8,  x:'50%',  y: '20%', angle: 120 },
  { w:5,  x: '15%', y:'-95%', angle: 200 }, { w:13, x:'-45%', y:'-65%', angle: 310 },
];

/* ── Bubble particles ────────────────────────────────── */
const BUBBLES = Array.from({ length: 20 }, (_, i) => ({
  w: 4 + Math.sin(i * 1.7) * 4 | 0,
  x: (Math.sin(i * 0.9) * 160).toFixed(0) + 'px',
  y: (-(Math.cos(i * 1.1) * 220 + 30)).toFixed(0) + 'px',
  delay: (i * 0.18).toFixed(2),
}));

const ScrollStory = () => {
  const sectionRef  = useRef(null);
  const tlRef       = useRef(null);
  const { theme }   = usePageTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Master scrollTrigger timeline (scrub = smooth reverse) ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=550%',
          scrub:   1.8,
          pin:     true,
          anticipatePin: 1,
          onUpdate: (self) => {
            /* Drive progress bar */
            gsap.set('.ss-prog-fill', { scaleX: self.progress });

            /* Swap stage caption by progress */
            const si = Math.min(4, Math.floor(self.progress * 5));
            document.querySelectorAll('.ss-caption').forEach((el, i) => {
              gsap.to(el, {
                opacity: i === si ? 1 : 0,
                y:       i === si ? 0 : (i < si ? -18 : 18),
                duration: 0.4,
              });
            });
          },
        },
      });
      tlRef.current = tl;

      /* ══ Stage 1: Entry — bottle drifts in ═══════════════ */
      tl.from('.ss-bottle-wrap', {
        scale: 0.65, opacity: 0, y: 80,
        duration: 2, ease: 'power3.out',
      });

      /* ══ Stage 2: Rotation + bg cross-fade ═══════════════ */
      tl.to('.ss-bottle-3d', {
        rotateY: 165, rotateX: -10,
        duration: 3, ease: 'none',
      }, '+=0.4');
      tl.to('.ss-bottle-wrap', { scale: 1.08, duration: 3, ease: 'none' }, '<');
      tl.to('.ss-bg-2',        { opacity: 1,  duration: 2.5 }, '<0.8');
      tl.to('.ss-bg-1',        { opacity: 0,  duration: 2   }, '<0.5');
      tl.to('.ss-ring-1',      { opacity: 0.7, scale: 1, duration: 2 }, '<0.5');
      tl.to('.ss-ring-2',      { opacity: 0.45, scale: 1, duration: 2 }, '<0.3');

      /* ══ Stage 3: Liquid + fruits + tilt ════════════════ */
      tl.to('.ss-bottle-3d', {
        rotateY: 215, rotateX: -26,
        duration: 2.5, ease: 'none',
      }, '+=0.3');
      tl.to('.ss-bottle-wrap',     { scale: 1.2,  duration: 2.5, ease: 'none' }, '<');
      tl.to('.ss-liquid-blob',     { opacity: 1, scaleY: 1, duration: 1.8 }, '<0.4');
      tl.to('.ss-liquid-stream',   { opacity: 1, scaleY: 1, duration: 1.5 }, '<0.4');
      tl.to('.ss-fruit', {
        opacity: 1, scale: 1, stagger: 0.18, duration: 1.2, ease: 'back.out(1.4)',
      }, '<0.6');
      tl.to('.ss-color-wash',      { opacity: 0.72, duration: 2 }, '<0.4');
      tl.to('.ss-bg-3',            { opacity: 0.55, duration: 2 }, '<0.5');

      /* ══ Stage 4: Peak – full splash ════════════════════ */
      tl.to('.ss-bottle-3d', {
        rotateY: 280, rotateX: -32,
        duration: 2, ease: 'none',
      }, '+=0.3');
      tl.to('.ss-bottle-wrap',   { scale: 1.34, duration: 2, ease: 'none' }, '<');
      tl.to('.ss-splash-ring-1', { scale: 1, opacity: 0.85, duration: 1.5 }, '<0.3');
      tl.to('.ss-splash-ring-2', { scale: 1, opacity: 0.60, duration: 1.5 }, '<0.3');
      tl.to('.ss-droplet',       { opacity: 1, scale: 1, stagger: 0.06, duration: 0.8 }, '<0.4');
      tl.to('.ss-bubble',        { opacity: 0.8, y: '-=30', stagger: 0.04, duration: 1 }, '<0.2');
      tl.to('.ss-bg-2',          { opacity: 0, duration: 2 }, '<0.5');
      tl.to('.ss-glow-halo',     { opacity: 1, scale: 1, duration: 1.5 }, '<0.3');

      /* ══ Stage 5: Settle ════════════════════════════════ */
      tl.to('.ss-bottle-3d', {
        rotateY: 360, rotateX: 0,
        duration: 2.8, ease: 'none',
      }, '+=0.4');
      tl.to('.ss-bottle-wrap',   { scale: 1.22, duration: 2.8, ease: 'none' }, '<');
      tl.to('.ss-splash-ring-1', { opacity: 0.4, duration: 2 }, '<0.5');
      tl.to('.ss-splash-ring-2', { opacity: 0.2, duration: 2 }, '<0.3');
      tl.to('.ss-liquid-stream', { scaleY: 0.6, duration: 2 }, '<0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="scroll-story" ref={sectionRef} id="scroll-story">

      {/* ── Background image layers ─────────────────────── */}
      <div className="ss-bg">
        <div className="ss-bg-img ss-bg-1" style={{ backgroundImage: 'url(/img1.jpeg)' }} />
        <div className="ss-bg-img ss-bg-2" style={{ backgroundImage: 'url(/img2.jpeg)' }} />
        <div className="ss-bg-img ss-bg-3" style={{ backgroundImage: 'url(/img3.jpeg)' }} />
        <div className="ss-bg-dark" />
      </div>

      {/* ── Theme colour wash ───────────────────────────── */}
      <div
        className="ss-color-wash"
        style={{ '--ss-acc': theme.accentRgb }}
      />

      {/* ── Depth rings (appear in stage 2) ─────────────── */}
      <div className="ss-ring ss-ring-1" style={{ '--ss-acc': theme.accentRgb }} />
      <div className="ss-ring ss-ring-2" style={{ '--ss-acc': theme.accentRgb }} />

      {/* ── Glow halo (stage 4 peak) ─────────────────────  */}
      <div className="ss-glow-halo" style={{ '--ss-acc': theme.accentRgb }} />

      {/* ── Main stage ──────────────────────────────────── */}
      <div className="ss-stage">

        {/* Orbiting fruits */}
        {ORBIT_FRUITS.map((f, i) => (
          <div
            key={i}
            className={`ss-fruit hf-${f.cls.replace('hf-', '')} sf-${i}`}
            style={{
              width:  f.w, height: f.w,
              '--orbit':  `${f.orbit}px`,
              '--angle':  `${f.angle}deg`,
              '--dur':    `${f.dur}s`,
              '--delay':  `${f.delay}s`,
            }}
          />
        ))}

        {/* Bubble particles */}
        {BUBBLES.map((b, i) => (
          <div key={i} className="ss-bubble"
            style={{ width: b.w, height: b.w, '--bx': b.x, '--by': b.y }}
          />
        ))}

        {/* Liquid effects */}
        <div className="ss-liquid-wrap" style={{ '--ss-acc': theme.accentRgb }}>
          <div className="ss-liquid-blob"   />
          <div className="ss-liquid-stream" />
          {/* Splash droplets */}
          {DROPLETS.map((d, i) => (
            <div key={i} className="ss-droplet"
              style={{
                width: d.w, height: d.w * 1.35,
                transform: `translate(${d.x}, ${d.y}) rotate(${d.angle}deg)`,
              }}
            />
          ))}
          {/* Splash rings */}
          <div className="ss-splash-ring-1" />
          <div className="ss-splash-ring-2" />
        </div>

        {/* ── Bottle ──────────────────────────────────────── */}
        <div className="ss-bottle-wrap">
          <div className="ss-bottle-3d">
            <div className="ss-bottle-reflection" />
            <img
              src="/chillsip orange juice.png"
              className="ss-bottle-img"
              alt="Chillsip Juice"
              draggable="false"
            />
            <div className="ss-bottle-shadow" />
          </div>
        </div>
      </div>

      {/* ── Stage captions ──────────────────────────────── */}
      <div className="ss-captions" style={{ '--ss-acc': theme.accentRgb }}>
        {STAGES.map((s, i) => (
          <div key={i} className={`ss-caption ${i === 0 ? 'active' : ''}`}>
            <span className="ss-cap-num">0{i + 1}</span>
            <h2 className="ss-cap-title">{s.title}</h2>
            <p  className="ss-cap-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Scroll progress bar ─────────────────────────── */}
      <div className="ss-prog-track">
        <div className="ss-prog-fill" style={{ '--ss-acc': theme.accentRgb }} />
      </div>

      {/* ── Scroll hint (visible only before scroll starts) ─ */}
      <div className="ss-scroll-hint">
        <span>Scroll to explore</span>
        <div className="ss-sh-arrow" />
      </div>
    </section>
  );
};

export default ScrollStory;
