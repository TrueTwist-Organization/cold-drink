import React from 'react';
import { motion } from 'framer-motion';
import './StaticPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="static-page-container">
      <div className="static-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Privacy <span className="gradient-text">Policy</span>
        </motion.h1>
      </div>

      <motion.div 
        className="static-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, make a purchase, sign up for our newsletter, or communicate with us. This may include your name, email address, shipping address, and payment information.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Process your transactions and manage your account.</li>
          <li>Send you technical notices, updates, security alerts, and support messages.</li>
          <li>Respond to your comments, questions, and requests.</li>
          <li>Communicate with you about products, services, offers, and events.</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>We do not share your personal information with third parties except as described in this privacy policy or as required by law. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>

        <h2>4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@chillsip.com.</p>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
