import React from 'react';
import { motion } from 'framer-motion';
import './StaticPage.css';

const TermsPage = () => {
  return (
    <div className="static-page-container">
      <div className="static-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Terms & <span className="gradient-text">Conditions</span>
        </motion.h1>
      </div>

      <motion.div 
        className="static-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>1. Introduction</h2>
        <p>Welcome to ChillSip. These terms and conditions outline the rules and regulations for the use of ChillSip's Website.</p>

        <h2>2. Intellectual Property Rights</h2>
        <p>Other than the content you own, under these Terms, ChillSip and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

        <h2>3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
          <li>publishing any Website material in any other media;</li>
          <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
          <li>publicly performing and/or showing any Website material;</li>
          <li>using this Website in any way that is or may be damaging to this Website;</li>
        </ul>

        <h2>4. No warranties</h2>
        <p>This Website is provided "as is," with all faults, and ChillSip express no representations or warranties, of any kind related to this Website or the materials contained on this Website.</p>

        <h2>5. Limitation of liability</h2>
        <p>In no event shall ChillSip, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website.</p>
      </motion.div>
    </div>
  );
};

export default TermsPage;
