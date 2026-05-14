import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { count, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHashLink = (hash) => {
    return isHome ? hash : `/${hash}`;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          Chill<span className="logo-sip">Sip</span>
        </Link>
        
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href={getHashLink('#game-arena')} onClick={closeMobileMenu}>Game Arena</a>
          
          <div className="dropdown">
            <button className="dropbtn">
              Categories <span className="caret">▾</span>
            </button>
            <div className="dropdown-content glass-panel">
              <Link to="/category/1" onClick={closeMobileMenu}>Soft Drinks</Link>
              <Link to="/category/2" onClick={closeMobileMenu}>Juices & Fruit</Link>
              <a href={getHashLink('#game-arena')} onClick={closeMobileMenu}>Play Games!</a>
              <Link to="/category/3" onClick={closeMobileMenu}>Iced & Chilled</Link>
              <Link to="/category/4" onClick={closeMobileMenu}>Energy Drinks</Link>
              <Link to="/category/5" onClick={closeMobileMenu}>Milk-Based</Link>
              <Link to="/category/6" onClick={closeMobileMenu}>Traditional</Link>
              <Link to="/category/7" onClick={closeMobileMenu}>Mocktails</Link>
              <Link to="/category/8" onClick={closeMobileMenu}>Trending / Special</Link>
            </div>
          </div>
          
          <button className="nav-cart-btn" onClick={() => { setIsCartOpen(true); closeMobileMenu(); }}>
            <ShoppingCart size={20} />
            {count > 0 && <span className="nav-cart-badge">{count}</span>}
          </button>
          
          <a href={getHashLink('#featured-drinks')} className="btn btn-outline nav-btn" onClick={closeMobileMenu}>SHOP NOW</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
