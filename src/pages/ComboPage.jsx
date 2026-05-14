import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { combos } from '../data/combos';
import { useCart } from '../context/CartContext';
import ScrollFramePlayerGSAP from '../components/ScrollFramePlayerGSAP';
import gsap from 'gsap';
import './ComboPage.css';

const ComboPage = () => {
  const { comboId } = useParams();
  const combo = combos.find(c => c.id.toString() === comboId);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = -(e.clientY - top - height / 2) / 20;
    setMousePos({ x, y });
  };

  React.useLayoutEffect(() => {
    // Synchronously scroll to top before browser paints to prevent blank page at bottom
    window.scrollTo(0, 0);
  }, [comboId]);

  if (!combo) {
    return (
      <div className="container" style={{ padding: '200px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: '#fff' }}>Combo not found</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const handleAdd = () => {
    // Add logic requires mapping to a cart item structure
    const cartItem = {
      id: `combo-${combo.id}`,
      name: combo.name,
      price: parseFloat(combo.price.replace(/[₹,]/g, '')),
      image: combo.image,
      desc: combo.desc
    };
    addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="combo-page" style={{ '--color': combo.color }}>
      <div className="combo-bg-glow" style={{ background: combo.color }}></div>
      
      {/* ══ CINEMATIC PINNED HERO (MODERN REVEAL) ════════════════════ */}
      <div className="combo-hero-scroll-wrapper" ref={containerRef}>
        <div className="combo-hero-pinned">
          <div className="combo-media-layer">
            <ScrollFramePlayerGSAP 
              frames={combo.frames} 
              pinRef={containerRef}
              scrollSensitivity={60}
            />
            <div className="combo-vignette"></div>
          </div>
        </div>
      </div>

      {/* ══ NEW DETAILS SECTION (NO BOX ANIMATION) ════════════════════ */}
      <section className="combo-details-section">
        <div className="container">
          <motion.div 
             className="combo-details-animated"
             initial={{ opacity: 0, y: 100 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-10%" }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
             <span className="combo-badge-floating glass-badge" style={{ color: combo.color }}>
               PREMIUM PACKAGE
             </span>
             <h1 className="combo-main-title">{combo.name}</h1>
             <p className="combo-summary">{combo.desc}</p>
             
             <div className="combo-includes-animated">
               {combo.items.map((item, i) => (
                 <motion.span 
                   key={i} 
                   className="combo-item-chip"
                   initial={{ opacity: 0, scale: 0.8 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
                   viewport={{ once: true }}
                 >
                   <CheckCircle2 size={12} /> {item}
                 </motion.span>
               ))}
             </div>

             <div className="combo-cta-group">
               <div className="combo-price-display">
                 <div className="price-label">Bundle Price</div>
                 <div className="price-amount" style={{ color: combo.color }}>{combo.price}</div>
               </div>
               <div className="combo-btns">
                  <button className="btn btn-primary" style={{ background: combo.color }} onClick={handleAdd}>
                    <Zap size={18} /> Get Pack
                  </button>
                  <button className={`btn btn-outline ${added ? 'added' : ''}`} onClick={handleAdd}>
                     {added ? 'In Cart' : 'Reserve'}
                  </button>
               </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComboPage;
