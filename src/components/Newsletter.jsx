import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section id="newsletter" className="newsletter-section">
      {/* Background decorative blobs */}
      <div className="nl-blob nl-blob-left"></div>
      <div className="nl-blob nl-blob-right"></div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          className="newsletter-card glass-panel"
        >
          <div className="nl-icon">❄️</div>
          <h2>GET COOL OFFERS IN <span className="gradient-text">YOUR INBOX</span></h2>
          <p>
            Subscribe for exclusive deals, new flavour drops, and icy surprises.
            No spam — only the chillest updates.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="nl-success"
            >
              🎉 You're in! Stay chill.
            </motion.div>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit}>
              <div className="nl-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="glass-input nl-input"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn btn-primary nl-btn"
                >
                  Subscribe ❄️
                </motion.button>
              </div>
              <p className="nl-privacy">We respect your privacy. Unsubscribe anytime.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
