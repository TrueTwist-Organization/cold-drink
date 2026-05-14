import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, ShoppingBag, X, Star, Calendar, Check } from 'lucide-react';
import { rewardSystem } from '../../utils/RewardSystem';
import './MyRewards.css';

/**
 * 🎁 My Rewards: Section to view and manage earned drink rewards.
 */

const MyRewards = ({ isOpen, onClose }) => {
  const [rewards, setRewards] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setRewards(rewardSystem.getRewards().reverse());
    }
  }, [isOpen]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const remaining = rewardSystem.getRemainingDaily();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="rewards-drawer-backdrop" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="rewards-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="rewards-header">
              <div className="header-title">
                <Gift className="icon" />
                <div>
                  <h3>My Rewards</h3>
                  <p>Daily limit: {remaining} left today</p>
                </div>
              </div>
              <button className="close-btn" onClick={onClose}><X /></button>
            </div>

            <div className="rewards-content">
              {rewards.length > 0 ? (
                <div className="rewards-list">
                  {rewards.map((r, i) => (
                    <motion.div 
                      key={r.id} 
                      className="reward-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="reward-visual">
                         <div className="bottle-stack">
                           {Array.from({ length: r.bottles }).map((_, b) => (
                             <motion.div 
                               key={b} 
                               className="bottle-icon"
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               transition={{ delay: 0.3 + (b * 0.1) }}
                             />
                           ))}
                         </div>
                         <div className="reward-pill">{r.game}</div>
                      </div>

                      <div className="reward-details">
                        <div className="reward-meta">
                          <Calendar size={12} /> {new Date(r.date).toLocaleDateString()}
                        </div>
                        <div className="reward-title">{r.bottles} Free Bottle{r.bottles > 1 ? 's' : ''}</div>
                        
                        <div className="promo-row">
                          <div className="promo-code">{r.code}</div>
                          <button 
                            className={`copy-btn ${copied === r.code ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(r.code)}
                          >
                            {copied === r.code ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-rewards">
                  <div className="empty-icon">🍹</div>
                  <h4>No Rewards Yet</h4>
                  <p>Play games in the Game Arena to earn free bottles!</p>
                  <button className="play-hint-btn" onClick={onClose}>Go to Game Arena</button>
                </div>
              )}
            </div>

            <div className="rewards-footer">
              <button className="shop-now-btn" onClick={() => {
                onClose();
                window.location.hash = 'best-sellers'; // scroll to shop section
              }}>
                <ShoppingBag size={18} /> Redeem in Shop
              </button>
              <div className="footer-hint"><Star size={12} fill="gold" color="gold" /> Rewards expire in 30 days</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyRewards;
