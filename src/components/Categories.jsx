import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { productsByCategory } from '../data/products';
import './Categories.css';

const Categories = () => {
  const { addToCart } = useCart();
  
  const handleOrder = () => {
    // p8-1 is ChillSip Summer Special (Berry Blast)
    const berryBlast = productsByCategory[8].find(p => p.id === 'p8-1');
    if (berryBlast) {
      addToCart(berryBlast);
    }
  };

  return (
    <section id="categories" className="categories-section">
      <div className="container">

        {/* Special Featured Section for Berry Blast */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 70, damping: 16 }}
          className="featured-section glass-panel"
        >
          {/* Background image covering the full box */}
          <div className="fs-bg-wrap">
            <img src="/chillsip summer special.png" alt="Summer Special" className="fs-bg-img" />
            <div className="fs-bg-overlay"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.2 }}
            className="featured-content"
          >
            <h3 className="trending-badge">🔥 Trending Summer Special</h3>
            <h2>BERRY BLAST EXPLOSION</h2>
            <p>Our top-selling sensation. A chaotic mix of wild berries, crushed ice, and electrifying energy. Don't miss out on the drink of the summer.</p>
            <button 
              className="btn btn-primary glass-btn-primary"
              onClick={handleOrder}
            >
              Order Now
            </button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Categories;
