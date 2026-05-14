import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, X, CheckCircle2 } from 'lucide-react';
import { combos } from '../data/combos';
import { useCart } from '../context/CartContext';
import ScrollFramePlayer from './ScrollFramePlayer';
import './ComboPacks.css';

const TiltCard = ({ children, className, onClick, color }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 15;
    const y = -(e.clientY - top - height / 2) / 15;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0, y: 0 }); }}
      animate={{ 
        rotateY: isHovering ? mousePos.x : 0, 
        rotateX: isHovering ? mousePos.y : 0,
        z: isHovering ? 30 : 0
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', '--combo-color': color, cursor: 'pointer' }}
    >
      {typeof children === 'function' ? children(isHovering) : children}
    </motion.div>
  );
};

const ComboPacks = () => {
  const navigate = useNavigate();



  return (
    <section id="combos" className="combos-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="section-header"
        >
          <span className="glass-badge">VALUE BUNDLES</span>
          <h2>SAVINGS IN <span className="gradient-text">COMBO PACKS</span></h2>
        </motion.div>

        <div className="combos-grid">
          {combos.map((combo, index) => {
            return (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: index * 0.15 }}
            >
              <TiltCard
                className="combo-card glass-panel"
                color={combo.color}
                onClick={() => navigate(`/combo/${combo.id}`)}
              >
              {(isHovering) => (
                <>
                <div className="combo-img-bg">
                  <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  <AnimatePresence>
                    {isHovering && combo.video && (
                      <motion.video
                        src={combo.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </AnimatePresence>
                </div>

              <div className="combo-card-content" style={{ transform: 'translateZ(30px)', position: 'relative', zIndex: 10 }}>
                <div className="combo-brand-badge">
                  <span className="brand-name">ChillSip</span>
                  <span className="brand-pack-label" style={{ color: combo.color }}>{combo.name.split(' ').slice(0,2).join(' ')}</span>
                </div>

                <div className="combo-info">
                  <h3>{combo.name}</h3>
                </div>

                <button className="combo-launch-btn">
                  <div className="btn-shine" />
                  Quick View <Zap size={18} />
                </button>
              </div>
              </>
              )}
            </TiltCard>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboPacks;
