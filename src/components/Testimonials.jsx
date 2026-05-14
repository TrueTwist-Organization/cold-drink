import React from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Fitness Influencer',
    avatar: '👩',
    text: 'ChillSip Berry Blast is my go-to post-workout drink! The flavors are insane and it actually feels premium.',
    rating: 5,
    color: 'var(--tertiary)',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    role: 'College Student',
    avatar: '👦',
    text: 'Ordered the Energy Combo pack and it lasted my whole exam week. Fast delivery, great taste — 10/10.',
    rating: 5,
    color: 'var(--primary)',
  },
  {
    id: 3,
    name: 'Neha Kapoor',
    role: 'Food Blogger',
    avatar: '👩‍🍳',
    text: 'The Mocktail range is absolutely stunning. Mojito flavor is restaurant quality in a bottle. Obsessed!',
    rating: 5,
    color: '#22C55E',
  },
  {
    id: 4,
    name: 'Arjun Patel',
    role: 'Tech Entrepreneur',
    avatar: '🧔',
    text: 'Neon Bolt keeps me going during long coding sessions. The glass packaging is next-level aesthetic.',
    rating: 5,
    color: '#3B82F6',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 100, rotateX: 10, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 80,
      damping: 18,
      delay: i * 0.15 
    },
  }),
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          className="section-header"
        >
          <span className="glass-badge">REAL PEOPLE</span>
          <h2>WHAT FANS <span className="gradient-text">SAY</span></h2>
        </motion.div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="testimonial-card glass-panel"
              style={{ '--t-color': r.color }}
            >
              <div className="quote-mark">"</div>
              <p className="review-text">{r.text}</p>
              <div className="stars">
                {'★'.repeat(r.rating)}
              </div>
              <div className="reviewer">
                <div className="avatar">{r.avatar}</div>
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="reviewer-role">{r.role}</div>
                </div>
              </div>
              <div className="card-accent" style={{ background: r.color }}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
