import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BestSellers.css';

const items = [
  { id: 1, name: 'Blue Lagoon Mocktail', badge: 'Top Fusion 🧊', color: '#00B0FF', image: '/chillsip Blue lagoon.png', categoryId: 7, productId: 'p7-2' },
  { id: 2, name: 'New Arrivals Pick', badge: 'New 🆕', color: '#FF6D00', image: '/chillsip new arrivals.png', categoryId: 8, productId: 'p8-2' },
  { id: 3, name: 'Summer Special', badge: 'Best Seller ⭐', color: '#FFD700', image: '/chillsip summer special.png', categoryId: 8, productId: 'p8-1' },
  { id: 4, name: 'Fizzy Burst', badge: 'New 🆕', color: '#FF5722', image: '/chillsip cola.png', categoryId: 1, productId: 'p1-1' },
  { id: 5, name: 'Sport Drink', badge: 'Best Seller ⭐', color: '#22C55E', image: '/chillsip sport drink.png', categoryId: 4, productId: 'p4-2' },
];

const BestSellers = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 2800);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    setActive(idx);
    startTimer();
  };

  const handleCardClick = (idx, item) => {
    // Navigate immediately on any card click for maximum interactivity
    navigate(`/category/${item.categoryId}`, { 
      state: { productId: item.productId } 
    });
  };

  const getIndices = () => {
    const result = [];
    const n = items.length;
    for (let offset = -2; offset <= 2; offset++) {
      result.push((active + offset + n) % n);
    }
    return result;
  };

  const indices = getIndices();

  const getCardStyle = (position) => {
    const isCenter = position === 0;
    const isAdjacent = Math.abs(position) === 1;
    const scale = isCenter ? 1.22 : isAdjacent ? 0.85 : 0.68;
    const blur = isCenter ? 0 : isAdjacent ? 3 : 7;
    const opacity = isCenter ? 1 : isAdjacent ? 0.65 : 0.38;
    const zIndex = isCenter ? 10 : isAdjacent ? 5 : 2;
    const translateX = position * 260;
    return { scale, blur, opacity, zIndex, translateX };
  };

  return (
    <section id="best-sellers" className="best-sellers-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="section-header-left"
        >
          <span className="glass-badge">MOST POPULAR</span>
          <h2>BEST SELLERS & <span className="gradient-text">NEW ARRIVALS</span></h2>
        </motion.div>
      </div>

      <div className="spotlight-carousel">
        {indices.map((itemIdx, i) => {
          const position = i - 2;
          const item = items[itemIdx];
          const { scale, blur, opacity, zIndex, translateX } = getCardStyle(position);
          const isCenter = position === 0;

          return (
            <motion.div
              key={`${itemIdx}-${i}`}
              className={`spotlight-card glass-panel${isCenter ? ' spotlight-active' : ''}`}
              style={{ '--c': item.color, zIndex, cursor: 'pointer' }}
              animate={{ x: translateX, scale, filter: `blur(${blur}px)`, opacity }}
              whileHover={{ 
                scale: isCenter ? 1.26 : scale * 1.15, 
                filter: 'blur(0px)', 
                opacity: 1,
                y: -10,
                transition: { duration: 0.3 }
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={() => handleCardClick(itemIdx, item)}
            >
              {isCenter && (
                <div className="card-glow-blob" style={{ background: item.color }} />
              )}
              <div className="card-badge-glow" style={{ background: item.color }}>
                {item.badge}
              </div>
              <div className="spotlight-img-container">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="spotlight-info">
                <h4>{item.name}</h4>
                <div className="rating">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={13} fill="#FFD700" color="#FFD700" />
                  ))}
                </div>
                {isCenter && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="click-hint"
                  >
                    Click to Explore Reveal
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="carousel-dots">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`dot${idx === active ? ' dot-active' : ''}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
