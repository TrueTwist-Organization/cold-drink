import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Palette, Gift, Star, ChevronRight, PlayCircle, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyRewards from './MyRewards';
import './GameArena.css';

/**
 * 🎪 Game Arena: The central hub for mini-games on the website.
 * Users can play games to earn rewards.
 */

const TiltCard = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20; // 20 is max tilt depth
    const y = -(e.clientY - top - height / 2) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        rotateY: isHovering ? mousePosition.x : 0,
        rotateX: isHovering ? mousePosition.y : 0,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

const GameArena = () => {
  const navigate = useNavigate();
  const [showRewards, setShowRewards] = useState(false);

  return (
    <section id="game-arena" className="game-arena-section">
      <div className="container">
        
        {/* Header Section */}
        <div className="game-arena-header">
           <motion.div 
             className="glass-badge"
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             🎮 WIN FREE BOTTLES
           </motion.div>
           
           <h2 className="section-title">
             The <span className="gradient-text">ChillSip</span> Game Arena
           </h2>
           <p className="section-subtitle">
             Play our interactive mini-games to earn rewards and free drink bottles every day!
           </p>
        </div>

        {/* 🎮 Game Cards Grid */}
        <div className="games-grid">
           
           {/* Game 1: Catch & Fill */}
           <TiltCard className="game-card catch-fill-card">
              <div className="game-card-bg">
                 <div className="floating-fruit f1">🍊</div>
                 <div className="floating-fruit f2">🍓</div>
                 <div className="floating-fruit f3">🍋</div>
              </div>

              <div className="game-card-content">
                 <div className="game-tag">🕹️ RECURRING</div>
                 <h3>Catch & Fill</h3>
                 <p>Catch falling fruits to fill your ChillSip bottle. React fast for a 4-bottle combo reward!</p>
                 
                 <div className="game-meta">
                   <span><Zap size={14} color="#ff9800" /> Fast-Paced</span>
                   <span><Trophy size={14} color="#FFD700" /> Up to 4 Bottles</span>
                 </div>

                 <button className="btn-launch" onClick={() => navigate('/game/catch')}>
                   <div className="btn-shine" />
                   Play Now <PlayCircle size={18} />
                 </button>
              </div>
           </TiltCard>

           {/* Game 2: Draw Your Drink */}
           <TiltCard className="game-card draw-drink-card">
              <div className="game-card-bg">
                 <div className="paint-splash p1" />
                 <div className="paint-splash p2" />
              </div>

              <div className="game-card-content">
                 <div className="game-tag">🎨 CREATIVE</div>
                 <h3>Draw Your Drink</h3>
                 <p>Design your own flavor label! Fill the bottle with colors and earn rewards based on detail.</p>
                 
                 <div className="game-meta">
                   <span><Palette size={14} color="#E91E63" /> Artistic</span>
                   <span><Trophy size={14} color="#FFD700" /> Up to 3 Bottles</span>
                 </div>

                 <button className="btn-launch" onClick={() => navigate('/game/draw')}>
                   <div className="btn-shine" />
                   Create Now <ChevronRight size={18} />
                 </button>
              </div>
           </TiltCard>

        </div>



      </div>

      <MyRewards isOpen={showRewards} onClose={() => setShowRewards(false)} />

    </section>
  );
};

export default GameArena;
