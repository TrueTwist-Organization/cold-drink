import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, X, PlayCircle, Zap, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { rewardSystem } from '../../utils/RewardSystem';
import { useCart } from '../../context/CartContext';
import { productsByCategory } from '../../data/products';
import AnimatedBackground from '../AnimatedBackground';
import './CatchAndFill.css';

/**
 * 🍓 Catch & Fill: Juice Frenzy
 * A high-performance canvas catching game.
 */

const FRUITS = [
  { id: 'orange', img: '/chillsip orange.png', color: '#FF8F00', fill: 'rgba(255, 143, 0, 0.8)' },
  { id: 'grape', img: '/chillsip cola.png', color: '#9C27B0', fill: 'rgba(156, 39, 176, 0.8)' },
  { id: 'strawberry', img: '/chillsip fruit mocktail.png', color: '#E91E63', fill: 'rgba(233, 30, 99, 0.8)' },
  { id: 'lemon', img: '/chillsip lemon.png', color: '#FFEB3B', fill: 'rgba(255, 235, 59, 0.8)' },
];

const CatchAndFill = ({ onClose }) => {
  const { addToCart } = useCart();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef();
  
  const [gameState, setGameState] = useState('START'); // START, COUNTDOWN, PLAYING, END
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [fillLevel, setFillLevel] = useState(0); // 0 to 100
  const [reward, setReward] = useState(null);
  const [combo, setCombo] = useState(0);
  
  // Game Logic Ref - avoid triggering re-renders for every frame
  const gameData = useRef({
    player: { x: 0, y: 0, w: 70, h: 100 },
    fruits: [],
    splashes: [],
    speedMult: 1.0,
    lastTime: 0,
    spawnTimer: 0,
    caughtLast: false,
    continuousCount: 0,
  });

  // 🎯 Start Game
  const startGame = () => {
    setGameState('COUNTDOWN');
    setCountdown(3);
    setTimeLeft(60);
    setScore(0);
    setFillLevel(0);
    setCombo(0);
    gameData.current.fruits = [];
    gameData.current.splashes = [];
    gameData.current.continuousCount = 0;
  };

  // ⏱️ Game Timer (1 minute)
  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'PLAYING' && timeLeft === 0) {
      finishGame(); // Time's up!
    }
  }, [gameState, timeLeft]);

  // ⏲️ Countdown Timer
  useEffect(() => {
    if (gameState === 'COUNTDOWN') {
      if (countdown && countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('PLAYING');
      }
    }
  }, [gameState, countdown]);

  // 🎮 Game Loop
  const animate = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;

    // Resize to container and handle High-DPI screens natively
    if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      gameData.current.player.y = ch - 110;
    }

    const { player, fruits, splashes } = gameData.current;
    
    // Clear and scale contexts to match visual CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1.0;
    ctx.filter = 'none';
    ctx.clearRect(0, 0, cw, ch);

    if (gameState === 'PLAYING') {
      // Spawn Fruit every 1-1.5s
      gameData.current.spawnTimer += (time - gameData.current.lastTime);
      if (gameData.current.spawnTimer > (1500 / gameData.current.speedMult)) {
        const type = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        fruits.push({
          id: Date.now(),
          type,
          x: Math.random() * (cw - 50) + 25,
          y: -50,
          speed: (Math.random() * 2 + 3) * gameData.current.speedMult,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1
        });
        gameData.current.spawnTimer = 0;
      }

      // 🍌 Update & Draw Fruits
      for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        f.y += f.speed;
        f.rot += f.vRot;

        // Collision Check
        if (f.y + 30 > player.y && f.x > player.x && f.x < player.x + player.w) {
          // CAUGHT!
          setScore(s => {
            const next = s + 10;
            return next;
          });
          
          setFillLevel(prev => Math.min(100, prev + 2.5));
          
          gameData.current.continuousCount++;
          if (gameData.current.continuousCount % 3 === 0) setCombo(c => c + 1);

          // Add splash
          splashes.push({
            x: f.x,
            y: player.y + 20,
            color: f.type.color,
            life: 1.0,
            particles: Array.from({ length: 8 }, () => ({
              vx: (Math.random() - 0.5) * 10,
              vy: Math.random() * -5 - 5,
              s: Math.random() * 4 + 2
            }))
          });

          fruits.splice(i, 1);
          continue;
        }

        // Miss check
        if (f.y > ch) {
          gameData.current.continuousCount = 0;
          setFillLevel(prev => Math.max(0, prev - 5));
          fruits.splice(i, 1);
          continue;
        }

        // Draw Fruit (Simple circle placeholder if imgs fail, or text emoji)
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.fillStyle = '#000000'; // Make sure the emoji rendering brush isn't tinted
        ctx.font = '70px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const emoji = f.type.id === 'orange' ? '🍊' : f.type.id === 'grape' ? '🍇' : f.type.id === 'strawberry' ? '🍓' : '🍋';
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
      }
    }

    // 💦 Draw Splashes
    ctx.save();
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.life -= 0.05;
      if (s.life <= 0) {
        splashes.splice(i, 1);
        continue;
      }
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.life);
      s.particles.forEach(p => {
        p.vy += 0.4; // gravity
        p.vx *= 0.95; 
        const px = s.x + (1 - s.life) * 10 * p.vx;
        const py = s.y + (1 - s.life) * 10 * p.vy;
        ctx.beginPath();
        ctx.arc(px, py, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();

    // 🧴 Draw Player (Bottle Shape)
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    // Draw Glass Outline
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + 10, player.y + player.h);
    ctx.lineTo(player.x + player.w - 10, player.y + player.h);
    ctx.lineTo(player.x + player.w, player.y);
    ctx.stroke();

    // Draw Liquid inside based on fillLevel
    if (fillLevel > 0) {
      const h = (player.h - 10) * (fillLevel / 100);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const lw = player.w - 24;
      ctx.fillRect(player.x + 12, player.y + player.h - h - 5, lw, h);
    }
    ctx.restore();

    gameData.current.lastTime = time;
    if (gameState === 'PLAYING') {
      if (fillLevel >= 100) {
        finishGame();
        return;
      }
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const finishGame = () => {
    setGameState('END');
    
    // Determine reward
    let bottles = 1;
    if (score >= 100 && score < 200) bottles = 1;
    else if (score >= 200 && score < 300) bottles = 2;
    else if (score >= 300 && score < 400) bottles = 3;
    else if (score >= 400) bottles = 4;

    const res = rewardSystem.saveReward(bottles, 'Catch & Fill');
    if (res.success) {
      setReward(res.reward);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, fillLevel]);

  // 🖱️ Movement Handler
  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      gameData.current.player.x = Math.max(10, Math.min(containerRef.current.clientWidth - 80, x - 35));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div className="game-overlay catch-fill-game" ref={containerRef}>
      {/* 1. Base vibrant juicy background for Catch & Fill with Unique Brand Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0B0E14' }}>
        <img 
          src="/chillsip summer special.png" 
          alt="ChillSip Brand Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
        />
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: 2 }} />

      {/* 📊 Score HUD */}
      <div className="game-hud" style={{ zIndex: 10 }}>
        <div className="hud-metric">
          <span className="label">TIME</span>
          <span className="value" style={{ color: timeLeft <= 10 ? '#f44336' : 'inherit' }}>{timeLeft}s</span>
        </div>
        <div className="hud-metric">
          <span className="label">SCORE</span>
          <span className="value">{score}</span>
        </div>
        <div className="hud-metric">
          <span className="label">JUICE FILL</span>
          <div className="progress-bg">
            <motion.div 
              className="progress-fill" 
              animate={{ width: `${fillLevel}%` }}
              style={{ background: 'linear-gradient(90deg, #ff9800, #ffeb3b)' }}
            />
          </div>
        </div>
        {combo > 0 && (
           <motion.div 
             key={combo}
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1.2, opacity: 1 }}
             exit={{ opacity: 0 }}
             className="combo-badge"
           >
             COMBO x{combo}!
           </motion.div>
        )}
      </div>

      <button className="game-close-btn" onClick={onClose} aria-label="Close Game">
        <X size={24} />
      </button>

      {/* 🚀 Start Screen */}
      <AnimatePresence>
        {gameState === 'START' && (
          <motion.div 
            className="game-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-icon-wrap">
              <Star className="modal-star" size={48} fill="gold" color="gold" />
            </div>
            <h2>Juice Frenzy!</h2>
            <p>Catch falling fruits to fill your ChillSip bottle. Fill it to 100% to win rewards!</p>
            <ul className="game-rules">
              <li>⏱️ You have 60 seconds to score as much as possible!</li>
              <li>🏆 400+ Score = 4 Bottles Reward</li>
              <li>🍊 Orange, Strawberry, Lemon, Grapes</li>
              <li>⚡ Don't miss fruits or juice level drops!</li>
            </ul>
            <button className="play-btn" onClick={startGame}>
              <PlayCircle /> Let's Play!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⏲️ Countdown Screen */}
      <AnimatePresence>
        {gameState === 'COUNTDOWN' && (
          <motion.div 
            className="countdown-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              className="countdown-num"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 Gameplay Instructional Text Overlay */}
      <AnimatePresence>
        {gameState === 'PLAYING' && timeLeft > 56 && (
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             style={{ 
               position: 'absolute', top: '220px', left: 0, width: '100%', 
               textAlign: 'center', zIndex: 10, pointerEvents: 'none',
               padding: '0 20px', boxSizing: 'border-box'
             }}
           >
             <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 900, color: '#FFD700', textShadow: '0 5px 20px rgba(0,0,0,0.9), 0 0 10px #FF9800', margin: '0 0 10px 0' }}>
                CATCH FRUITS IN THE BOTTLE!
             </h2>
             <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.9)', margin: 0 }}>
                Get the highest score for bigger rewards!
             </p>
           </motion.div>
        )}
      </AnimatePresence>

      {/* 🏆 Result Screen */}
      <AnimatePresence>
        {gameState === 'END' && (
          <motion.div 
            className="game-modal result-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="result-header">
              <motion.div 
                className="congratulations-card"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  {Array.from({ length: reward?.bottles || 1 }).map((_, i) => (
                    <img key={i} src="/chillsip best seller.png" alt="Victory Bottle" className="victory-bottle" />
                  ))}
                </div>
                <div className="congrats-text-wrap">
                  <h2 className="congrats-title">CONGRATULATIONS!</h2>
                  <h3 className="win-subtitle">YOU WIN!</h3>
                </div>
              </motion.div>
              <Trophy size={40} color="#FFD700" className="trophy-pulse" />
            </div>
            
            <div className="result-stats">
              <div className="stat">
                <span>Final Score</span>
                <strong>{score}</strong>
              </div>
              <div className="stat">
                <span>Reward</span>
                <strong>{reward?.bottles || 0} Bottle{reward?.bottles > 1 ? 's' : ''}</strong>
              </div>
            </div>

            {reward ? (
              <div className="reward-box-dual">
                <div className="reward-box green-box">
                  <p>Use code at checkout to redeem:</p>
                  <div className="reward-code">{reward.code}</div>
                  <p className="claim-msg">Saved to your rewards!</p>
                </div>
                <button className="game-buy-now-btn" onClick={() => {
                  const product = productsByCategory[1][0]; // Cola
                  addToCart(product);
                }}>
                  <Zap size={16} fill="currentColor" /> Purchase Now
                </button>
              </div>
            ) : (
              <p className="limit-msg">Daily reward limit reached or score too low.</p>
            )}

            <div className="modal-actions">
              <button className="restart-btn" onClick={startGame}>
                <RefreshCcw size={18} /> Play Again
              </button>
              <button className="finish-btn" onClick={onClose}>
                Return to Shop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatchAndFill;
