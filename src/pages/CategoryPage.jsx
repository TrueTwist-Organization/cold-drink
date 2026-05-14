import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Star, ShoppingCart, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/categories';
import { productsByCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import ScrollFramePlayerGSAP from '../components/ScrollFramePlayerGSAP';
import gsap from 'gsap';
import './CategoryPage.css';

/* ── Product card (glass style matching image 2) ─────────────────── */
const ProductCard = ({ product, accent, index, onClickMedia }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ y: -8, scale: 1.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ '--accent': accent }}
    >
      {/* accent top stripe */}
      <div className="pc-stripe" style={{ background: accent }} />

      {/* rating badge */}
      <div className="pc-rating-badge" style={{ color: accent }}>
        <Star size={12} fill={accent} /> {product.rating}
      </div>

      {discount > 0 && (
        <div className="product-discount-badge">{discount}% OFF</div>
      )}

      {/* image/video area */}
      <div 
        className="pc-img-area" 
        onClick={() => onClickMedia(product)}
        style={{ cursor: 'pointer' }}
        title="Tap to view media"
      >
        <div className="pc-img-glow" style={{ background: accent }} />
        
        <AnimatePresence mode="wait">
          {!hovered ? (
            <motion.img 
              key="img"
              src={product.image} 
              alt={product.name} 
              className="pc-img" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              key="vid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pc-vid-wrap"
            >
              <video
                src={product.vid || product.hoverVid || product.image.replace('.png', '.mp4').replace('.jpg', '.mp4')}
                autoPlay
                loop
                muted
                playsInline
                className="pc-vid"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* info */}
      <div className="pc-info">
        <h3 className="pc-name">{product.name}</h3>
        <p className="pc-desc">{product.desc}</p>
        <div className="pc-meta">
          <div className="pc-pricing">
            <span className="pc-price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="pc-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span className="pc-reviews">{product.reviews.toLocaleString()} reviews</span>
        </div>
        <div className="pc-actions">
          <motion.button
            className="pc-btn-buy"
            style={{ background: accent }}
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={14} /> Buy Now
          </motion.button>
          <motion.button
            className="pc-btn-cart"
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
            animate={added ? { borderColor: '#00ff88', color: '#00ff88' } : {}}
          >
            <ShoppingCart size={14} />
            {added ? 'Added!' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Category Page ──────────────────────────────────────────── */
const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id.toString() === categoryId);
  const products = productsByCategory[parseInt(categoryId)] || [];
  
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentHeroFrames, setCurrentHeroFrames] = useState(category?.heroFrames);
  const [activeProductName, setActiveProductName] = useState(category?.name);
  const containerRef = useRef(null);

  const location = useLocation();

  useLayoutEffect(() => { 
    // Check if we came from a link that wants to show a specific product's media
    const stateProduct = location.state?.productId;
    const initialProduct = stateProduct ? products.find(p => p.id === stateProduct) : null;

    if (initialProduct && initialProduct.frames) {
      setCurrentHeroFrames(initialProduct.frames);
      setActiveProductName(initialProduct.name);
    } else {
      setCurrentHeroFrames(category?.heroFrames);
      setActiveProductName(category?.name);
    }

    window.scrollTo(0, 0); 
    return () => {
      gsap.getById('heroTrigger')?.kill();
    };
  }, [categoryId, category, location.state]);

  if (!category) {
    return (
      <div className="container" style={{ padding: '200px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: '#fff' }}>Category not found</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <section className="cat-page" style={{ '--cat': category.color }}>

      {/* ── Animated colour blobs ── */}
      <div className="cat-blob cat-blob-1" />
      <div className="cat-blob cat-blob-2" />

      {/* ══ CINEMATIC HERO (GSAP Pinned) ══════════════════════════════ */}
      <div className="cat-hero-scroll-wrapper" ref={containerRef}>
        <div className="cat-hero pinned-hero">
          
          <div className="cat-hero-media" aria-hidden="true">
            {currentHeroFrames ? (
              <ScrollFramePlayerGSAP 
                key={`${categoryId}-${activeProductName}`}
                frames={currentHeroFrames} 
                pinRef={containerRef}
                scrubSpeed={0.8}
                scrollSensitivity={60} 
                onProgress={setLoadProgress}
              />
            ) : (
              <img src={category.image} alt="" className="cat-hero-animation-img" />
            )}
            <div className="cat-hero-overlay" />
          </div>

          {/* Centered Cinematic Content */}
          <div className="cat-hero-cinematic-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="cas-content-inner"
            >
              <Link to="/" className="back-link-cinematic">
                <ArrowLeft size={16} /> Back
              </Link>
              
              <h1 className="cas-category-name-large">
                {activeProductName}
              </h1>
              
              <p className="cas-category-desc-cinematic">
                {category.desc}
              </p>

            </motion.div>

            {/* Scroll indicator */}
            <div className="cas-scroll-hint-cinematic">
              <div className="cas-scroll-line-cinematic" />
            </div>
          </div>
        </div>
      </div>

      {/* ══ PRODUCTS SECTION ════════════════════════════════════ */}
      <div className="cat-products">
        <div className="container">
          <motion.div
            className="cat-prod-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2 className="cat-prod-title">Available Collection</h2>
              <p className="cat-prod-sub">Premium {category.name.split('(')[0].trim()} for you</p>
            </div>
            <span
              className="cat-count-badge"
              style={{ borderColor: `${category.color}44`, color: category.color }}
            >
              {products.length} items
            </span>
          </motion.div>

          {products.length > 0 ? (
            <div className="cat-products-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  accent={category.color}
                  index={index}
                  onClickMedia={(prod) => {
                    if (prod.frames) {
                      setCurrentHeroFrames(prod.frames);
                      setActiveProductName(prod.name);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


export default CategoryPage;
