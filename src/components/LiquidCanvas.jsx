import React, { useRef, useEffect, useCallback } from 'react';
import { usePageTheme } from '../context/PageThemeContext';
import './LiquidCanvas.css';

/* ── Helpers ─────────────────────────────────────────── */
function parseRgb(str) {
  return str.split(',').map(n => parseFloat(n.trim()));
}
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/* ── Smooth quadratic bezier path ────────────────────── */
function drawSmoothPath(ctx, pts) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) * 0.5;
    const my = (pts[i].y + pts[i + 1].y) * 0.5;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
}

/* ── Calculate unit normal at each point ─────────────── */
function normals(pts) {
  return pts.map((p, i) => {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { nx: -dy / len, ny: dx / len };
  });
}

/* ── Stream definitions ──────────────────────────────── */
const STREAM_CONFIGS = [
  /* width  alpha  speed  offset  phase  wX    wY  */
  { w: 200, a: 0.58, sp: 0.7,  off: 0.0, ph: 0.0, wX: 0.038, wY: 0.022 },
  { w: 110, a: 0.42, sp: 1.05, off: 1.4, ph: 1.8, wX: 0.045, wY: 0.028 },
  { w: 65,  a: 0.30, sp: 0.55, off: 2.8, ph: 3.5, wX: 0.052, wY: 0.032 },
  { w: 38,  a: 0.20, sp: 1.35, off: 0.9, ph: 5.2, wX: 0.060, wY: 0.038 },
];

/* How many control points define each stream centerline */
const NUM_PTS = 14;
/* Droplets and sparkles */
const NUM_DROPS   = 16;
const NUM_SPARKLE = 5;
const TARGET_FPS  = 30;

/* ── Build centerline for one stream at time t ───────── */
function buildCenterline(W, H, t, cfg, mouse, scroll) {
  const { sp, off, ph, wX, wY } = cfg;
  const st = t * sp + off;
  const scrollShift = scroll * 0.00015;
  const pts = [];
  for (let i = 0; i < NUM_PTS; i++) {
    const p = i / (NUM_PTS - 1);
    /* Base diagonal path: top-right → center-left */
    const bx = W * (1.04 - p * 0.58);
    const by = H * (p * 0.70 - 0.04 + scrollShift);
    /* Organic wave displacement */
    const ox = Math.sin(p * Math.PI * 2.2 + st * 0.9 + ph) * W * wX;
    const oy = Math.cos(p * Math.PI * 1.8 + st * 0.65)      * H * wY;
    /* Subtle mouse influence */
    const mx = (mouse.x - 0.7) * W * 0.04 * p;
    const my = (mouse.y - 0.3) * H * 0.03 * p;
    pts.push({ x: bx + ox + mx, y: by + oy + my });
  }
  return pts;
}

/* ── Draw one stream (3-pass: glow → body → highlight) ─ */
function drawStream(ctx, W, pts, cfg, rgb) {
  const [r, g, b] = rgb;
  const { w, a } = cfg;

  /* shared gradient along path direction */
  const p0 = pts[0], pN = pts[pts.length - 1];
  const grad = ctx.createLinearGradient(p0.x, p0.y, pN.x, pN.y);
  grad.addColorStop(0,    `rgba(${r},${g},${b},0)`);
  grad.addColorStop(0.10, `rgba(${r},${g},${b},${a * 0.55})`);
  grad.addColorStop(0.30, `rgba(${r},${g},${b},${a})`);
  grad.addColorStop(0.70, `rgba(${r},${g},${b},${a * 0.85})`);
  grad.addColorStop(0.90, `rgba(${r},${g},${b},${a * 0.35})`);
  grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

  /* Pass 1: wide outer glow */
  ctx.save();
  ctx.beginPath();
  drawSmoothPath(ctx, pts);
  ctx.lineWidth   = w * 4;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.globalAlpha = 0.09;
  ctx.strokeStyle = `rgb(${r},${g},${b})`;
  ctx.stroke();
  ctx.restore();

  /* Pass 2: main body */
  ctx.save();
  ctx.beginPath();
  drawSmoothPath(ctx, pts);
  ctx.lineWidth    = w;
  ctx.lineCap      = 'round';
  ctx.lineJoin     = 'round';
  ctx.strokeStyle  = grad;
  ctx.shadowColor  = `rgba(${r},${g},${b},0.55)`;
  ctx.shadowBlur   = w * 0.45;
  ctx.stroke();
  ctx.restore();

  /* Pass 3: edge highlight (inner bright streak) */
  const norms = normals(pts);
  const hiPts = pts.map((p, i) => ({
    x: p.x + norms[i].nx * w * 0.28,
    y: p.y + norms[i].ny * w * 0.28,
  }));
  const hiGrad = ctx.createLinearGradient(p0.x, p0.y, pN.x, pN.y);
  hiGrad.addColorStop(0,    'rgba(255,255,255,0)');
  hiGrad.addColorStop(0.15, 'rgba(255,255,255,0.32)');
  hiGrad.addColorStop(0.55, 'rgba(255,255,255,0.22)');
  hiGrad.addColorStop(0.88, 'rgba(255,255,255,0.10)');
  hiGrad.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.save();
  ctx.beginPath();
  drawSmoothPath(ctx, hiPts);
  ctx.lineWidth    = Math.max(2, w * 0.14);
  ctx.lineCap      = 'round';
  ctx.strokeStyle  = hiGrad;
  ctx.shadowColor  = 'rgba(255,255,255,0.35)';
  ctx.shadowBlur   = 5;
  ctx.stroke();
  ctx.restore();

  /* Pass 4: inner subsurface glow (slightly offset, lighter color) */
  const glowPts = pts.map((p, i) => ({
    x: p.x - norms[i].nx * w * 0.12,
    y: p.y - norms[i].ny * w * 0.12,
  }));
  const ssg = ctx.createLinearGradient(p0.x, p0.y, pN.x, pN.y);
  ssg.addColorStop(0,   `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},0)`);
  ssg.addColorStop(0.2, `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},${a * 0.35})`);
  ssg.addColorStop(0.8, `rgba(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)},${a * 0.20})`);
  ssg.addColorStop(1,   `rgba(${r},${g},${b},0)`);
  ctx.save();
  ctx.beginPath();
  drawSmoothPath(ctx, glowPts);
  ctx.lineWidth   = w * 0.4;
  ctx.lineCap     = 'round';
  ctx.strokeStyle = ssg;
  ctx.shadowBlur  = 0;
  ctx.stroke();
  ctx.restore();
}

/* ── Draw droplets flowing along the stream path ─────── */
function drawDroplets(ctx, W, H, t, rgb, mouse, scroll, dropCount) {
  const [r, g, b] = rgb;
  const scrollShift = scroll * 0.00015;
  for (let i = 0; i < dropCount; i++) {
    const phase  = i / dropCount;
    const travel = ((t * 0.22 + phase) % 1);
    /* Follow the same rough flow path */
    const bx = W * (1.04 - travel * 0.6);
    const by = H * (travel * 0.72 - 0.04 + scrollShift);
    const ox = Math.sin(travel * 10 + i * 0.9) * W * 0.06;
    const oy = Math.cos(travel * 8  + i * 0.7) * H * 0.04;
    const px  = bx + ox + (mouse.x - 0.7) * W * 0.03 * travel;
    const py  = by + oy + (mouse.y - 0.3) * H * 0.02 * travel;
    /* Fade in at start, fade out at end */
    const life  = 1 - Math.abs(travel - 0.5) * 1.9;
    const alpha = Math.max(0, life) * 0.75;
    const sz    = 2 + Math.sin(i * 1.3 + t) * 1.4;

    if (alpha <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.5, sz), 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(${r},${g},${b},${alpha})`;
    ctx.shadowColor = `rgba(${r},${g},${b},0.55)`;
    ctx.shadowBlur  = 8;
    ctx.fill();
    /* tiny white highlight dot */
    ctx.beginPath();
    ctx.arc(px - sz * 0.28, py - sz * 0.28, Math.max(0.3, sz * 0.28), 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(255,255,255,${alpha * 0.55})`;
    ctx.shadowBlur  = 0;
    ctx.fill();
    ctx.restore();
  }
}

/* ── Shimmer sparkle points ──────────────────────────── */
function drawSparkles(ctx, W, H, t, rgb) {
  const [r, g, b] = rgb;
  for (let i = 0; i < NUM_SPARKLE; i++) {
    const px = W * (0.52 + Math.sin(t * 0.7 + i * 1.4) * 0.28);
    const py = H * (0.05 + Math.cos(t * 0.55 + i * 1.1) * 0.28);
    const pr = 2.5 + Math.sin(t * 2.2 + i) * 1.5;
    const pa = 0.30 + Math.sin(t * 3 + i * 0.8) * 0.20;
    ctx.save();
    /* star-like cross */
    for (let arm = 0; arm < 4; arm++) {
      const ang = (arm / 4) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(px + Math.cos(ang) * pr * 2.2, py + Math.sin(ang) * pr * 2.2);
      ctx.lineTo(px - Math.cos(ang) * pr * 2.2, py - Math.sin(ang) * pr * 2.2);
      ctx.lineWidth   = pr * 0.55;
      ctx.lineCap     = 'round';
      ctx.strokeStyle = `rgba(255,255,255,${pa * 0.7})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
      ctx.shadowBlur  = pr * 2;
      ctx.stroke();
    }
    /* central dot */
    ctx.beginPath();
    ctx.arc(px, py, pr * 0.6, 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(255,255,255,${pa})`;
    ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
    ctx.shadowBlur  = pr * 4;
    ctx.fill();
    ctx.restore();
  }
}

/* ── Large ambient glow at flow zone ─────────────────── */
function drawAmbientGlow(ctx, W, H, rgb) {
  const [r, g, b] = rgb;
  const cx = W * 0.72;
  const cy = H * 0.35;
  const rad = Math.min(W, H) * 0.65;
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
  grd.addColorStop(0,    `rgba(${r},${g},${b},0.18)`);
  grd.addColorStop(0.35, `rgba(${r},${g},${b},0.10)`);
  grd.addColorStop(0.70, `rgba(${r},${g},${b},0.04)`);
  grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
  ctx.save();
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/* ── Ripple rings around flow ────────────────────────── */
function drawRipples(ctx, W, H, t, rgb) {
  const [r, g, b] = rgb;
  /* Three ripple centers that pulse slowly */
  const rippleCenters = [
    { x: W * 0.78, y: H * 0.18, speed: 0.5, delay: 0    },
    { x: W * 0.63, y: H * 0.40, speed: 0.4, delay: 1.2  },
    { x: W * 0.52, y: H * 0.58, speed: 0.55, delay: 2.4 },
  ];
  rippleCenters.forEach(rc => {
    for (let ring = 0; ring < 3; ring++) {
      const phase  = ((t * rc.speed + rc.delay + ring * 0.8) % 3);
      const radius = phase * Math.min(W, H) * 0.10;
      const alpha  = Math.max(0, (1 - phase / 3)) * 0.25;
      ctx.save();
      ctx.beginPath();
      ctx.arc(rc.x, rc.y, radius, 0, Math.PI * 2);
      ctx.lineWidth   = 1.5;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.8})`;
      ctx.shadowBlur  = 6;
      ctx.stroke();
      ctx.restore();
    }
  });
}

/* ══════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════ */
const LiquidCanvas = () => {
  const canvasRef  = useRef(null);
  const { theme }  = usePageTheme();

  /* Lerped "current" display color + target */
  const dispColor  = useRef([199, 95, 113]);
  const tgtColor   = useRef([199, 95, 113]);
  const mouseRef   = useRef({ x: 0.75, y: 0.25 });
  const scrollRef  = useRef(0);
  const rafRef     = useRef(null);
  const timeRef    = useRef(0);
  const lastFrameRef = useRef(0);
  const isMobile   = useRef(window.innerWidth < 768);

  /* Update target when theme changes */
  useEffect(() => {
    tgtColor.current = parseRgb(theme.accentRgb);
  }, [theme.accentRgb]);

  /* ── Main render loop ─────────────────────────────── */
  const render = useCallback((ts = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (ts - lastFrameRef.current < 1000 / TARGET_FPS) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }
    lastFrameRef.current = ts;

    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;
    const t   = timeRef.current;
    const mob = isMobile.current;

    /* Smooth color lerp */
    dispColor.current = lerpColor(dispColor.current, tgtColor.current, 0.022);
    const rgb = dispColor.current;

    ctx.clearRect(0, 0, W, H);

    /* Ambient glow fills the top-right zone */
    drawAmbientGlow(ctx, W, H, rgb);

    /* Ripple rings (skip on mobile for perf) */
    if (!mob) drawRipples(ctx, W, H, t, rgb);

    /* Streams — fewer on mobile */
    const streamCount = mob ? 2 : 3;
    for (let si = 0; si < streamCount; si++) {
      const cfg = STREAM_CONFIGS[si];
      const pts = buildCenterline(W, H, t, cfg, mouseRef.current, scrollRef.current);
      drawStream(ctx, W, pts, cfg, rgb);
    }

    /* Droplets */
    const dropCount = mob ? Math.floor(NUM_DROPS * 0.45) : NUM_DROPS;
    drawDroplets(ctx, W, H, t, rgb, mouseRef.current, scrollRef.current, dropCount);

    /* Sparkles (desktop only) */
    if (!mob) drawSparkles(ctx, W, H, t, rgb);

    timeRef.current += 0.010;
    rafRef.current = requestAnimationFrame(render);
  }, []);

  /* ── Lifecycle ────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width  = width  || window.innerWidth;
      canvas.height = height || window.innerHeight;
      isMobile.current = width < 768;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const start = () => {
      if (!rafRef.current) {
        lastFrameRef.current = 0;
        rafRef.current = requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      stop();
    };
  }, [render]);

  /* ── Mouse tracking ───────────────────────────────── */
  const onMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left)  / (rect.width  || 1),
      y: (e.clientY - rect.top)   / (rect.height || 1),
    };
  }, []);

  /* ── Scroll tracking ──────────────────────────────── */
  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="liquid-canvas"
      onMouseMove={onMouseMove}
    />
  );
};

export default LiquidCanvas;
