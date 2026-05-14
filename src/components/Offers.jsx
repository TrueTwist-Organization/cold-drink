import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, Clock, Zap } from 'lucide-react';
import './Offers.css';

const Offers = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <section id="offers" className="offers-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="section-header"
        >
          <span className="glass-badge">LIMITED TIME</span>
          <h2>EXCLUSIVE <span className="gradient-text">OFFERS</span></h2>
        </motion.div>

        <div className="offers-grid">
          {/* Card 1: 20% OFF */}
          <motion.div 
            whileHover={{ scale: 1.02, translateY: -10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.1 }}
            className="offer-card glass-panel main-glow hero-visual-card card-20-off"
          >
            <div className="card-bg-layer clean-lifestyle-bg"></div>
            <div className="offer-card-vignette"></div>
            <div className="first-card-copy">
              <h3 className="first-card-title">ChillSip <span>Energy Drink</span></h3>
            </div>
            <div className="floating-cubes" aria-hidden="true">
              <span className="cube cube-1"></span>
              <span className="cube cube-2"></span>
              <span className="cube cube-3"></span>
              <span className="cube cube-4"></span>
            </div>
            <div className="hero-bottle-overlay">
              <img src="/chillsip energy drink.png" alt="Energy Drink Hero" className="hero-bottle-float" />
            </div>

            <div className="visual-hero-content-center">
              <div className="discount-badge-accurate-v2 animate-float">
                <span className="num">20%</span>
                <span className="off">OFF</span>
              </div>
              <button className="btn btn-primary ice-btn-primary">Claim Now</button>
            </div>
          </motion.div>

          {/* Card 2: Buy 2 Get 1 */}
          <motion.div 
            whileHover={{ scale: 1.02, translateY: -10 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.25 }}
            className="offer-card glass-panel secondary-glow b2g1-unified-card"
          >
            <div className="card-bg-layer clean-lifestyle-bg" style={{ opacity: 0.5 }}></div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 5, padding: '2rem 0' }}>
              <motion.img 
                src="/23.03.2026_15.10.12_REC-removebg-preview.png" 
                alt="Buy 2 Get 1" 
                className="hero-bottle-float b2g1-clinking-anim"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              />
            </div>

            <div className="b2g1-footer">
              <div className="offer-badge-tiny">LIMITED STOCK</div>
              <button className="btn btn-outline ice-btn-outline-small">Shop Now</button>
            </div>
            <div className="card-shine"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
