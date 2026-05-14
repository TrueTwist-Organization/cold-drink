import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { PageThemeProvider } from './context/PageThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import AnimatedBackground from './components/AnimatedBackground';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import './App.css';

import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ComboPage from './pages/ComboPage';
import ContactUsPage from './pages/ContactUsPage';
import AboutUsPage from './pages/AboutUsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';
const CatchGamePage = lazy(() => import('./pages/CatchGamePage'));
const DrawGamePage = lazy(() => import('./pages/DrawGamePage'));

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="app-container">
      <AnimatedBackground />
      <CursorGlow />
      <Navbar />
      <CartDrawer />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route path="/"                     element={<Home />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/combo/:comboId"       element={<ComboPage />} />
              <Route path="/contact"              element={<ContactUsPage />} />
              <Route path="/about"                element={<AboutUsPage />} />
              <Route path="/terms"                element={<TermsPage />} />
              <Route path="/privacy"              element={<PrivacyPolicyPage />} />
              <Route path="/disclaimer"           element={<DisclaimerPage />} />
              <Route path="/game/catch"           element={
                <Suspense fallback={<div className="game-loader">Loading Game...</div>}>
                  <CatchGamePage />
                </Suspense>
              } />
              <Route path="/game/draw"            element={
                <Suspense fallback={<div className="game-loader">Loading Game...</div>}>
                  <DrawGamePage />
                </Suspense>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <PageThemeProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
      </PageThemeProvider>
    </CartProvider>
  );
}

export default App;
