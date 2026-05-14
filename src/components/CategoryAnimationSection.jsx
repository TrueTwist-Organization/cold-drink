import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFramePlayerGSAP from './ScrollFramePlayerGSAP';
import './CategoryAnimationSection.css';

/**
 * 🌠 CategoryAnimationSection
 * This component handles the full-screen scroll-locked frame animation
 * for a specific category.
 */
const CategoryAnimationSection = ({ 
  category, 
  onClose,
  scrollSensitivity = 80,
  scrubSpeed = 0.8
}) => {
  const containerRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!category) return null;

  const { frames, name, desc, color } = category;

  return (
    <div 
      ref={containerRef} 
      className="cas-section"
      style={{ '--acc': color }}
    >
      {/* Scroll-based Frame Player */}
      <ScrollFramePlayerGSAP 
        frames={frames} 
        pinRef={containerRef}
        scrollSensitivity={scrollSensitivity}
        scrubSpeed={scrubSpeed}
      />

      {/* Close Button */}
      <button className="cas-close-btn" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Floating Content Overlay */}
      <div className="cas-content">
        <motion.h1 
          className="cas-category-name"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {name}
        </motion.h1>
        
        <motion.p 
          className="cas-category-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          {desc}
        </motion.p>
      </div>

      {/* Scroll Indicator Hint */}
      <div className="cas-scroll-hint">
        <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll to Explore</span>
        <div className="cas-scroll-line" />
      </div>

      {/* Small Progress Indicator (Fixed at top) */}
      <div className="cas-progress-bar" />
    </div>
  );
};

export default CategoryAnimationSection;
