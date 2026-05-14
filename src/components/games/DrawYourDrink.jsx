import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Eraser, RotateCcw, Check, Sparkles, Download, X, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { rewardSystem } from '../../utils/RewardSystem';
import { useCart } from '../../context/CartContext';
import { productsByCategory } from '../../data/products';
import AnimatedBackground from '../AnimatedBackground';
import './DrawYourDrink.css';

/**
 * 🎨 Draw Your Drink: Canvas Game
 * Creative drawing game with completion detection and rewards.
 */

const COLORS = [
  { id: 'orange', value: '#FF9800', name: 'Zesty' },
  { id: 'purple', value: '#9C27B0', name: 'Grape' },
  { id: 'red',    value: '#F44336', name: 'Berry' },
  { id: 'green',  value: '#4CAF50', name: 'Lime' },
  { id: 'blue',   value: '#2196F3', name: 'Ocean' }
];

const BRUSH_SIZES = [8, 16, 24];

const DrawYourDrink = ({ onClose }) => {
  const { addToCart } = useCart();
  const canvasRef = useRef(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [brushSize, setBrushSize] = useState(16);
  const [drawing, setDrawing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [reward, setReward] = useState(null);
  const [strokes, setStrokes] = useState(0);
  const [usedColors, setUsedColors] = useState(new Set([COLORS[0].value]));

  // 🖱️ High-DPI Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    // Only resize if actually needed to avoid clearing drawings on re-renders
    if (canvas.width !== Math.floor(rect.width * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  // 📝 Drawing Logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || finished) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setStrokes(prev => prev + 1);
  };

  // ⏱️ Timer Logic
  useEffect(() => {
    if (!finished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!finished && timeLeft === 0) {
      handleDone(); // Auto-finish when time is up
    }
  }, [finished, timeLeft]);

  const draw = (e) => {
    if (!drawing || finished) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  // 🪄 Undo / Clear
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes(0);
    setTimeLeft(60);
    setUsedColors(new Set([color]));
  };

  // ✅ Completion Logic
  const handleDone = () => {
    if (strokes < 5) {
      alert("Try to draw a bit more before finishing!");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(50, 50, canvas.width - 100, canvas.height - 100).data;
    
    // Simple pixel detection
    let coloredPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i + 3] > 50) coloredPixels++;
    }

    const totalArea = (canvas.width - 100) * (canvas.height - 100);
    const coverage = coloredPixels / totalArea;

    if (coverage < 0.15) {
      alert("Please fill the bottle outline with more color!");
      return;
    }

    // Success!
    setFinished(true);
    
    // Reward Logic
    let bottles = 1;
    if (usedColors.size >= 3 && strokes > 50) bottles = 3;
    else if (usedColors.size >= 2 || strokes > 30) bottles = 2;
    
    const res = rewardSystem.saveReward(bottles, 'Draw Your Drink');
    if (res.success) {
      setReward(res.reward);
      confetti({
        particleCount: 150,
        spread: 90,
        colors: Array.from(usedColors)
      });
    }
  };

  const handleDownload = () => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     const link = document.createElement('a');
     link.download = 'my-chillsip-creation.png';
     link.href = canvas.toDataURL();
     link.click();
  };

  return (
    <div className="game-overlay draw-game">
      {/* Paint Brush Art Background to match Game Card perfectly */}
      <div style={{ 
        position: 'absolute', inset: 0, zIndex: 0, 
        background: `linear-gradient(rgba(25, 20, 29, 0.5), rgba(42, 33, 61, 0.9)), url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&auto=format&fit=crop') center/cover`
      }} />

      <div className="draw-container" style={{ zIndex: 10, position: 'relative' }}>
        <div className="draw-header">
          <div className="header-info">
            <h2><Sparkles className="sparkle" /> Draw Your Drink</h2>
            <p>Fill the bottle with your favorite flavors using colors below!</p>
          </div>
          {!finished && (
             <div className="draw-timer" style={{ color: timeLeft <= 10 ? '#f44336' : 'white', fontWeight: 'bold' }}>
               ⏳ {timeLeft}s Left
             </div>
          )}
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        <div className="canvas-stack">
           <div className="bottle-outline-layer" />
           <canvas 
             ref={canvasRef}
             width={320}
             height={500}
             onMouseDown={startDrawing}
             onMouseMove={draw}
             onMouseUp={stopDrawing}
             onMouseOut={stopDrawing}
             onTouchStart={startDrawing}
             onTouchMove={draw}
             onTouchEnd={stopDrawing}
           />
           {finished && (
             <motion.div 
               className="completion-animation"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
             >
                <div className="bottle-fill-anim" />
             </motion.div>
           )}
        </div>

        {!finished ? (
          <div className="draw-toolbar">
            <div className="toolbar-section">
              <label><Palette size={16} /> Flavors</label>
              <div className="color-palette">
                {COLORS.map(c => (
                  <button 
                    key={c.id}
                    className={`color-dot ${color === c.value ? 'active' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => {
                      setColor(c.value);
                      setUsedColors(s => new Set([...s, c.value]));
                    }}
                    title={c.name}
                  />
                ))}
                <button 
                  className={`color-dot eraser ${color === '#000000' ? 'active' : ''}`}
                  onClick={() => setColor('#000000')}
                  title="Eraser (Blackout)"
                >
                  <Eraser size={20} />
                </button>
              </div>
            </div>

            <div className="toolbar-section sizes">
              <label>Brush Size</label>
              <div className="brush-sizes">
                 {BRUSH_SIZES.map(s => (
                   <button 
                     key={s} 
                     className={`size-btn ${brushSize === s ? 'active' : ''}`}
                     onClick={() => setBrushSize(s)}
                   >
                     <div style={{ width: s/1.5, height: s/1.5, background: 'white', borderRadius: '50%' }} />
                   </button>
                 ))}
              </div>
            </div>

            <div className="toolbar-actions">
               <button className="action-btn clear" onClick={clearCanvas}>
                 <RotateCcw size={18} /> Restart
               </button>
               <button className="action-btn done" onClick={handleDone}>
                 <Check size={18} /> Finished Drawing
               </button>
            </div>
          </div>
        ) : (
          <motion.div 
            className="draw-reward-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
             <div className="victory-wrap">
               <img src="/chillsip best seller.png" alt="Victory Bottle" className="victory-bottle-img" />
               <h2 className="congrats-main">CONGRATULATIONS!</h2>
               <h3 className="win-sub">YOU WIN!</h3>
             </div>
             <p className="master-p">Your unique blend has been saved to the flavor archive.</p>
             {reward ? (
               <div className="reward-info">
                 <div className="reward-badge">
                   <Star fill="white" size={16} /> <strong>{reward.bottles} BOTTLE{reward.bottles > 1 ? 's' : ''} REWARD</strong>
                 </div>
                 <div className="promo-code">{reward.code}</div>
               </div>
             ) : (
               <div className="limit-box">Daily reward limit reached!</div>
             )}
              <div className="reward-actions">
                <button className="game-buy-now-btn" onClick={() => {
                   const product = productsByCategory[8][2]; // Best Seller
                   addToCart(product);
                }}>
                  <Zap size={16} fill="currentColor" /> Purchase Now
                </button>
                <button className="save-btn" onClick={handleDownload}><Download size={18} /> Save Artwork</button>
                <button className="play-again" onClick={() => {
                   setFinished(false);
                   setReward(null);
                   setTimeLeft(60);
                   clearCanvas();
                }}>New Creation</button>
                <button className="exit-btn" onClick={onClose}>Back to Shop</button>
              </div>
          </motion.div>
        )}
        <div className="draw-hint">
          <Lightbulb size={14} /> <span>Tip: Use more than 3 colors for a bigger reward!</span>
        </div>
      </div>
    </div>
  );
};

export default DrawYourDrink;
