import React from 'react';
import { motion } from 'framer-motion';
import './StaticPage.css';

const AboutUsPage = () => {
  return (
    <div className="static-page-container">
      <div className="static-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About <span className="gradient-text">Us</span>
        </motion.h1>
      </div>

      <motion.div 
        className="static-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p>Welcome to ChillSip, your ultimate destination for refreshing, high-quality beverages. We believe that every sip should be an experience, an explosion of flavor that awakens your senses and leaves you wanting more.</p>
        
        <h2>Our Story</h2>
        <p>Founded in 2026, ChillSip started with a simple idea: to revolutionize the cold drink industry by bringing bold, innovative flavors to the market. We were tired of the same old boring sodas and wanted to create something truly unique.</p>

        <h2>Our Mission</h2>
        <p>Our mission is to craft the most delicious, refreshing beverages using only the highest quality ingredients. We are committed to sustainability, innovation, and, most importantly, our customers' satisfaction.</p>
        
        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Premium Ingredients:</strong> We source the finest ingredients from around the world.</li>
          <li><strong>Unique Flavors:</strong> Our expert mixologists are constantly creating new and exciting combinations.</li>
          <li><strong>Sustainable Practices:</strong> We care about our planet and use eco-friendly packaging.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AboutUsPage;
