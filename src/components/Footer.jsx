import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-gradient-border"></div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo" onClick={handleHomeClick}>
            Chill<span className="gradient-text">Sip</span>
          </Link>
          <p className="footer-about">
            Redefining refreshment with a neon twist. The future of cold drinks is here.
          </p>
          <div className="social-links">
            {[
              { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
              { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
              { icon: <Youtube size={18} />, href: '#', label: 'YouTube' },
              { icon: <Send size={18} />, href: '#', label: 'Telegram' },
            ].map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="social-icon-btn"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/" onClick={handleHomeClick}>Home</Link></li>
            <li><a href="#product-categories">Categories</a></li>
            <li><a href="#best-sellers">Best Sellers</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Company & Legal</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h4 style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#00f2fe'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
              Contact Us <span style={{ fontSize: '0.8em', opacity: 0.8 }}>↗</span>
            </h4>
          </Link>
          <ul>
            <li>📧 hello@chillsip.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 404 Cyber City, DLF Phase 2, Gurugram</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} ChillSip. All Rights Reserved. Stay Chill. ❄️</p>
            <div className="credits">
              <span>Designed By <a href="https://truetwist.in/" target="_blank" rel="noopener noreferrer">Trutwist</a></span>
              <span className="separator">|</span>
              <span>Marketing By <a href="https://369network.com/" target="_blank" rel="noopener noreferrer">369 Network</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
