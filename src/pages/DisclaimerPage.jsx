import React from 'react';
import { motion } from 'framer-motion';
import './StaticPage.css';

const DisclaimerPage = () => {
  return (
    <div className="static-page-container">
      <div className="static-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text">Disclaimer</span>
        </motion.h1>
      </div>

      <motion.div 
        className="static-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2>1. General Information</h2>
        <p>The information provided by ChillSip on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>

        <h2>2. External Links Disclaimer</h2>
        <p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>

        <h2>3. Health & Dietary Information</h2>
        <p>The products and information provided on this site are not intended to diagnose, treat, cure, or prevent any disease. Please consult with a healthcare professional before making any changes to your diet or consuming new products, especially if you have known allergies or medical conditions.</p>

        <h2>4. Limitation of Liability</h2>
        <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
      </motion.div>
    </div>
  );
};

export default DisclaimerPage;
