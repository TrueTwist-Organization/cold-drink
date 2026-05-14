import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePageTheme } from '../context/PageThemeContext';
import { categories } from '../data/categories';
import { categoryFrameMapping } from '../data/category_frame_mapping';
import CategoryAnimationSection from './CategoryAnimationSection';
import './ProductCategories.css';

/* ── 3D tilt cover card ─────────────────────────────────── */
const CategoryCard = ({ item, index }) => {
  const navigate   = useNavigate();
  const cardRef    = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness:200, damping:24 });
  const sy = useSpring(my, { stiffness:200, damping:24 });
  const rotX = useTransform(sy, [-0.5,0.5], [ 10,-10]);
  const rotY = useTransform(sx, [-0.5,0.5], [-12, 12]);

  /* Convert hex color to rgb string */
  const hexRgb = (hex) => {
    const h = hex.replace('#','');
    const n = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
    return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
  };

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0); setHovered(false);
  }, [mx, my]);

  return (
    <motion.div
      ref={cardRef}
      className="cat-card"
      style={{ '--acc': item.color, '--acc-rgb': hexRgb(item.color), rotateX: rotX, rotateY: rotY, transformStyle:'preserve-3d' }}
      initial={{ opacity:0, y:55, scale:0.88 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:false, amount:0.15 }}
      transition={{ duration:0.65, delay:index*0.08, ease:[0.16,1,0.3,1] }}
      whileHover={{ z:30 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={() => navigate(`/category/${item.id}`)}
    >
      {/* Full-cover background image/video */}
      <div className="cat-img-cover">
        <AnimatePresence mode="wait">
          {!hovered ? (
            <motion.img
              key="img"
              src={item.image}
              alt={item.name}
              className="cat-cover-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <motion.div
              key="vid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cat-vid-wrap"
            >
              {item.hoverVid ? (
                <video
                  src={item.hoverVid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="cat-cover-vid"
                />
              ) : (
                <motion.img
                  src={item.image}
                  className="cat-cover-img"
                  animate={{ scale: 1.1 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Multi-layer dark gradient overlay */}
        <div className="cat-overlay" />
        <div className="cat-overlay-color" style={{ background: item.gradient || item.color }} />
      </div>

      {/* Animated gradient border on hover */}
      <div className="cat-border-ring" />

      {/* Glow highlight */}
      <div className="cat-glow-spot" />

      {/* Emoji badge */}
      <div className="cat-emoji-badge">{item.emoji}</div>

      {/* Bottom text */}
      <div className="cat-info" style={{ transform:'translateZ(24px)' }}>
        <h3 className="cat-name">{item.name}</h3>
        <p className="cat-desc">{item.desc}</p>
        <div className="cat-cta">
          <span>Explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Gloss sweep on hover */}
      {hovered && <div className="cat-gloss-sweep" />}
    </motion.div>
  );
};

/* ── Section ─────────────────────────────────────────────── */
const ProductCategories = () => {
  const { theme } = usePageTheme();

  return (
  <section id="product-categories" className="pcat-section">
    {/* Animated blobs matching active bottle */}
    <motion.div
      className="pcat-blob pcat-blob-a"
      animate={{ background: `radial-gradient(circle, rgba(${theme.accentRgb},0.22), transparent 65%)` }}
      transition={{ duration:1.6, ease:'easeInOut' }}
    />
    <motion.div
      className="pcat-blob pcat-blob-b"
      animate={{ background: `radial-gradient(circle, rgba(${theme.accentRgb},0.16), transparent 65%)` }}
      transition={{ duration:1.8, ease:'easeInOut' }}
    />

    <div className="container">
      <motion.div
        className="section-header"
        initial={{ opacity:0, y:35 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:false, amount:0.3 }}
        transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
      >
        <motion.span
          className="glass-badge"
          animate={{
            color:       theme.tagClr,
            borderColor: `rgba(${theme.accentRgb},0.45)`,
            background:  `rgba(${theme.accentRgb},0.12)`,
          }}
          transition={{ duration: 1.0 }}
        >
          🍹 BROWSE BY CATEGORY
        </motion.span>
        <h2 className="pcat-heading">
          <span className="pcat-h1">Drink</span>
          <motion.span
            className="pcat-h2"
            animate={{
              background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.tagClr} 55%, ${theme.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 18px rgba(${theme.accentRgb},0.45))`,
            }}
            transition={{ duration:1.2 }}
          >
            Categories
          </motion.span>
        </h2>
        <p className="pcat-sub">Tap any category to explore the cinematic reveal</p>
      </motion.div>

      <div className="cat-grid">
        {categories.map((item, i) => (
          <CategoryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  </section>
  );
};


export default ProductCategories;
