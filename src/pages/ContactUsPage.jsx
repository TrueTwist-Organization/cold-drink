import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-us-page">
      <div className="contact-hero">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get In <span className="gradient-text">Touch</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Have a question about our flavors, an order issue, or just want to say hi? We're all ears!
        </motion.p>
      </div>

      <div className="contact-container container">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>Contact <span className="gradient-text">Information</span></h2>
          <p>Fill out the form and our team will get back to you within 24 hours.</p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="icon-circle"><Phone size={24} /></div>
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
                <p>Toll-Free: 1800-123-CHILL</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-circle"><Mail size={24} /></div>
              <div>
                <h3>Email</h3>
                <p>hello@chillsip.com</p>
                <p>support@chillsip.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-circle"><MapPin size={24} /></div>
              <div>
                <h3>Address</h3>
                <p>404 Cyber City, DLF Phase 2,</p>
                <p>Gurugram, Haryana 122008, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isSubmitted ? (
            <div className="success-message">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="success-icon"
              >
                ✓
              </motion.div>
              <h3>Message Sent Successfully!</h3>
              <p>Thanks for reaching out. We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <textarea 
                  name="message" 
                  placeholder="Your Message..." 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                ></textarea>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="submit-btn"
              >
                Send Message <Send size={18} />
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;
