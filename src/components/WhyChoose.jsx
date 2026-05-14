import React from 'react';
import { motion } from 'framer-motion';
import './WhyChoose.css';

const features = [
  {
    image: '/ice fresh.png?v=2',
    title: 'Ice Fresh',
    desc: 'Every bottle is chilled to sub-zero perfection before it reaches you.',
    color: 'var(--primary)',
    theme: 'ice',
  },
  {
    image: '/fast delivery.png?v=2',
    title: 'Fast Delivery',
    desc: 'Lightning-speed delivery guaranteed within 30 minutes, anywhere.',
    color: '#3B82F6',
    theme: 'speed',
  },
  {
    image: '/nature ingredients.png?v=2',
    title: 'Natural Ingredients',
    desc: 'Only real fruit extracts and natural flavors — zero artificial junk.',
    color: '#22C55E',
    theme: 'nature',
  },
  {
    image: '/premium quality.png?v=2',
    title: 'Premium Quality',
    desc: 'Lab-tested, certified, and crafted with obsessive attention to detail.',
    color: 'var(--tertiary)',
    theme: 'luxury',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: (i) => ({ 
    opacity: 0, 
    x: i % 2 === 0 ? -80 : 80,
    rotate: i % 2 === 0 ? -3 : 3,
    scale: 0.9 
  }),
  visible: { 
    opacity: 1, x: 0, rotate: 0, scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 16 } 
  },
};

const WhyChoose = () => {
  return (
    <section id="why-us" className="why-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="section-header"
        >
          <span className="glass-badge">OUR EDGE</span>
          <h2>WHY CHOOSE <span className="gradient-text">CHILLSIP?</span></h2>
        </motion.div>

        <motion.div
          className="why-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((f) => (
            <motion.img
              key={f.title}
              custom={features.indexOf(f)}
              variants={cardVariants}
              whileHover={{ scale: 1.04, rotateY: 6, rotateX: -4 }}
              className="why-full-image"
              src={f.image}
              alt={f.title}
              loading="lazy"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;
