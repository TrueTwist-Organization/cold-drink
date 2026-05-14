import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './FeaturedDrinks.css';

const drinks = [
  { id: 'f1', name: 'Mango Fusion Juice', price: 99, image: '/chillsip mango juice.png', rating: 4.9 },
  { id: 'f2', name: 'Cold Coffee', price: 129, image: '/chillsip cold coffee.png', rating: 4.8 },
  { id: 'f3', name: 'Blue Lagoon Mocktail', price: 159, image: '/chillsip Blue lagoon.png', rating: 4.9 },
  { id: 'f4', name: 'Energy Drink', price: 119, image: '/chillsip energy drink.png', rating: 4.7 },
];

const FeaturedDrinks = () => {
  const { addToCart } = useCart();

  return (
    <section id="featured-drinks" className="featured-drinks-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          className="section-header"
        >
          <span className="glass-badge">TRENDING NOW</span>
          <h2>PREMIUM <span className="gradient-text">SELECTIONS</span></h2>
        </motion.div>

        <div className="drinks-grid">
          {drinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 80, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ type: 'spring', stiffness: 90, damping: 18, delay: index * 0.15 }}
              whileHover={{ y: -15, rotateX: 5, rotateY: 5, perspective: 1000 }}
              className="drink-card glass-panel"
            >
              <div className="card-top">
                <div className="rating-badge">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <span>{drink.rating}</span>
                </div>
              </div>
              <div className="drink-image-wrapper">
                <div className="blob-bg"></div>
                <img src={drink.image} alt={drink.name} className="drink-card-img" />
              </div>
              <div className="drink-info">
                <h3>{drink.name}</h3>
                <div className="price-tag">₹{drink.price}</div>
                <button 
                  className="btn btn-primary neon-cart-btn"
                  onClick={() => addToCart(drink)}
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
              <div className="card-glow-effect"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDrinks;
