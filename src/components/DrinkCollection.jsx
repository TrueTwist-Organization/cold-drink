import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { usePageTheme } from '../context/PageThemeContext';
import { useCart } from '../context/CartContext';
import ScrollFramePlayer from './ScrollFramePlayer';
import './DrinkCollection.css';

/* ══════════════════════════════════════════════════════════
   PRODUCTS — each has a fruits[] array:
     cls       — h3f-* CSS shape class (from Hero.css, global scope)
     size      — diameter px
     restX/Y   — idle float position  (fraction of scene w/h)
     convX/Y   — Kumo converge pos    (fraction — near bottle)
     glowColor — RGBA for hover glow
   ══════════════════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 'p1-1', name:'Chillsip Special', sub:'Signature Series',
    desc:'Our flagship citrus blend, sun-kissed and freshly squeezed for a premium cooling experience.',
    vid: '/Chillsip special .mp4',
    accent:'#FF8500', accentRgb:'255,133,0', tagClr:'#FFD060',
    price: 40,
    tag:'🔥 SIGNATURE',
    fruits: [],
  },
  {
    id: 'p6-3', name:'Aam Panna', sub:'Desi Series',
    desc:'Raw mango tangy cooler with a hint of roasted cumin and black salt.',
    vid: '/chillsip aam pana.mp4',
    accent:'#9CCC65', accentRgb:'156,204,101', tagClr:'#E6FFC1',
    price: 40,
    tag:'🍋 TRADITIONAL',
    fruits:[],
  },
  {
    id: 'p2-1', name:'Mango Magic', sub:'Tropical Series',
    desc:'Luscious alphonso mangoes blended to silky perfection.',
    img:'/chillsip mango juice.png',
    accent:'#E08C10', accentRgb:'224,140,16', tagClr:'#FFE080',
    price: 60,
    tag:'🥭 TRENDING',
    fruits:[],
  },
  {
    id: 'p7-3', name:'Berry Bliss', sub:'Antioxidant Series',
    desc:'Wild strawberries, blueberries — packed with goodness.',
    img:'/chillsip fruit mocktail.png',
    accent:'#C23560', accentRgb:'194,53,96', tagClr:'#FF9BB5',
    price: 150,
    tag:'🍓 NEW ARRIVAL',
    fruits:[],
  },
];

/* ══════════════════════════════════════════════════════════
   KumoCard — Kumo-style interactive 3D product card
   ══════════════════════════════════════════════════════════ */
const KumoCard = ({ p, index }) => {
  const { addToCart } = useCart();
  const cardRef  = useRef(null);
  const sceneRef = useRef(null);

  const [cardHovered, setCardHovered] = useState(false);
  const [hovFruit,    setHovFruit]    = useState(null);
  const [sceneDims,   setSceneDims]   = useState({ w: 320, h: 255 });
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  
  const handleOrder = (e) => {
    e.preventDefault();
    addToCart(p);
  };

  /* 3D tilt tracking */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 185, damping: 22 });
  const sy = useSpring(my, { stiffness: 185, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], [ 10, -10]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-12,  12]);

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);

  /* Measure scene container */
  useEffect(() => {
    if (!sceneRef.current) return;
    const update = () => {
      const r = sceneRef.current.getBoundingClientRect();
      setSceneDims({ w: r.width || 320, h: r.height || 255 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(sceneRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!cardRef.current || shouldLoadMedia) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMedia(true);
          observer.disconnect();
        }
      },
      { rootMargin: '260px 0px' }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [shouldLoadMedia]);

  const anyHov = hovFruit !== null;

  return (
    <motion.div
      ref={cardRef}
      className="kc-card"
      style={{
        '--acc':     p.accent,
        '--acc-rgb': p.accentRgb,
        '--tag-clr': p.tagClr,
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 65, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0,  scale: 1    }}
      viewport={{ once: false, amount: 0.14 }}
      transition={{ duration: 0.68, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); setCardHovered(false); setHovFruit(null); }}
    >
      {/* Card dark glass base */}
      <div className="kc-base" />

      {/* Animated glowing border on hover */}
      <div className="kc-border-glow" />

      {/* Top edge highlight line */}
      <div className="kc-top-line" />

      {/* Left liquid fill bar */}
      <div className="kc-liquid-bar"><div className="kc-liquid-fill" /></div>

      {/* Badge tag */}
      <span className="kc-tag">{p.tag}</span>

      {/* ════════════════════════════════════════════════════
          KUMO SCENE — bottle + orbiting ingredients
          ════════════════════════════════════════════════════ */}
      <div ref={sceneRef} className="kc-scene" style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}>

        {/* Per-flavor scene atmosphere glow */}
        <motion.div
          className="kc-scene-glow"
          animate={{
            opacity:    cardHovered ? 1   : 0.55,
            scale:      cardHovered ? 1.1 : 1,
            background: `radial-gradient(ellipse 80% 80% at 50% 50%,
              rgba(${p.accentRgb},0.28) 0%,
              rgba(${p.accentRgb},0.10) 50%,
              transparent 72%)`,
          }}
          transition={{ duration: 0.55 }}
        />

        {/* ── Interactive fruit ingredients ───────────── */}
        {p.fruits.map((f, i) => {
          const isHov   = hovFruit === i;
          /* Kumo effect: on card hover fruits converge toward bottle */
          const posX    = cardHovered ? f.convX : f.restX;
          const posY    = cardHovered ? f.convY : f.restY;
          const targetX = posX * sceneDims.w - f.size / 2;
          const targetY = posY * sceneDims.h - f.size / 2;

          return (
            <motion.div
              key={i}
              className="kc-fruit"
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width:  f.size,
                height: f.size,
                zIndex: isHov ? 20 : 8,
                '--glow': f.glow,
                cursor: 'default',
              }}
              animate={{
                x:       targetX,
                y:       targetY,
                scale:   isHov ? 1.55 : cardHovered ? 1.06 : 1.0,
                opacity: anyHov && !isHov ? 0.12 : 1.0,
                rotateZ: cardHovered ? f.rot : 0,
              }}
              transition={{
                x: { type: 'spring', stiffness: 95, damping: 18, mass: 0.85 },
                y: { type: 'spring', stiffness: 95, damping: 18, mass: 0.85 },
                scale:   { type: 'spring', stiffness: 220, damping: 22 },
                rotateZ: { type: 'spring', stiffness: 70,  damping: 16 },
                opacity: { duration: 0.25 },
              }}
              onMouseEnter={() => setHovFruit(i)}
              onMouseLeave={() => setHovFruit(null)}
            >
              <div className={`kc-fruit-tile ${isHov ? 'kc-fruit-tile-hovered' : ''}`}>
                <div
                  className={`h3f-base ${f.cls} kc-fruit-shape
                    ${isHov    ? 'kcf-hovered' : ''}
                    ${anyHov && !isHov ? 'kcf-dimmed' : ''}`}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </motion.div>
          );
        })}

        {/* ── Full Cover Product Image/Video/Frames ─────────────────── */}
        <div className="kc-bottle-wrap">
          {p.frames ? (
            <div className="kc-bottle-frames">
               <ScrollFramePlayer frames={p.frames} className="kc-bottle-img" />
            </div>
          ) : p.vid ? (
            <>
              <motion.div
                className="kc-video-placeholder"
                animate={{ opacity: mediaReady ? 0 : 1 }}
                transition={{ duration: 0.35 }}
              />
              {shouldLoadMedia && (
                <motion.video
                  src={p.vid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="kc-bottle-img"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: mediaReady ? 1 : 0,
                    scale: cardHovered ? 1.08 : 1.0,
                  }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  onLoadedData={() => setMediaReady(true)}
                />
              )}
            </>
          ) : (
            <motion.img
              src={p.img}
              alt=""
              className="kc-bottle-img"
              animate={{
                scale: cardHovered ? 1.08 : 1.0,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          
          {/* Subtle overlay so text/tiles pop better */}
          <motion.div
            className="kc-img-overlay"
            animate={{ opacity: cardHovered ? 0.35 : 0.15 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Hovering fruit name badge */}
        <AnimatePresence>
          {hovFruit !== null && (
            <motion.div
              className="kc-fruit-label"
              initial={{ opacity: 0, y: 6,  scale: 0.85 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 3,  scale: 0.90 }}
              transition={{ duration: 0.20 }}
              style={{
                bottom: 10,
                left: '50%',
                color:       p.tagClr,
                borderColor: `rgba(${p.accentRgb},0.45)`,
                background:  `rgba(${p.accentRgb},0.14)`,
              }}
            >
              {p.fruits[hovFruit]?.cls
                .replace('h3f-','')
                .replace('-lg','')
                .replace('-slice',' slice')
                .replace(/-/g,' ')
                .toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ── END SCENE ───────────────────────────────────── */}

      {/* ── Info text ─────────────────────────────────── */}
      <div className="kc-info" style={{ transform: 'translateZ(14px)' }}>
        <p className="kc-sub">{p.sub}</p>
        <h3 className="kc-name">{p.name}</h3>
        <p className="kc-desc">{p.desc}</p>
        <div className="kc-footer">
          <button onClick={handleOrder} className="kc-btn" style={{ border:'none', background:'none', cursor:'pointer' }}>
            Order Now →
          </button>
          <div className="kc-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   DrinkCollection — main section
   ══════════════════════════════════════════════════════════ */
const DrinkCollection = () => {
  const { theme } = usePageTheme();

  return (
    <section id="drink-collection" className="dc-section">
      {/* Ambient background blobs */}
      <motion.div
        className="dc-blob dc-blob-a"
        animate={{ background: `radial-gradient(circle, rgba(${theme.accentRgb},0.22), transparent 65%)` }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.div
        className="dc-blob dc-blob-b"
        animate={{ background: `radial-gradient(circle, rgba(${theme.accentRgb},0.14), transparent 65%)` }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      <div className="container">
        {/* Section header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="glass-badge"
            animate={{
              color:       theme.tagClr,
              borderColor: `rgba(${theme.accentRgb},0.45)`,
              background:  `rgba(${theme.accentRgb},0.12)`,
              boxShadow:   `0 0 18px rgba(${theme.accentRgb},0.18)`,
            }}
            transition={{ duration: 1.0 }}
          >
            🍹 EXPLORE OUR COLLECTION
          </motion.div>

          <h2 className="dc-heading">
            <span className="dc-h-line dch-1">Fresh</span>
            <motion.span
              className="dc-h-line dch-2"
              animate={{
                background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.tagClr} 40%, ${theme.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 20px rgba(${theme.accentRgb},0.45))`,
              }}
              transition={{ duration: 1.2 }}
            >
              Flavors
            </motion.span>
          </h2>

          <p className="dc-subtitle">
            Hover each bottle — watch the ingredients come alive.
          </p>
        </motion.div>

        <div className="dc-grid">
          {PRODUCTS.slice(0, 1).map((p, i) => (
            <KumoCard key={p.id} p={p} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="dc-viewall"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <motion.a
            href="#product-categories"
            className="dc-viewall-btn"
            animate={{
              background:  `linear-gradient(135deg, ${theme.accent}, rgba(${theme.accentRgb},0.60))`,
              boxShadow: `0 10px 40px rgba(${theme.accentRgb},0.45), 0 0 60px rgba(${theme.accentRgb},0.15)`,
            }}
            transition={{ duration: 1.0 }}
            style={{ display:'inline-block', borderRadius:50, padding:'1rem 3rem', color:'#000', fontWeight:800, fontSize:'1.05rem', textDecoration:'none', position:'relative', overflow:'hidden' }}
            whileHover={{ scale: 1.04, y: -4 }}
          >
            View Full Collection ✦
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default DrinkCollection;
