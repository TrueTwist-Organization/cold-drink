import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Check, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, removeFromCart, updateQty, total, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=cart, 1=checkout, 2=success

  const handleCheckout = () => setCheckoutStep(1);
  const handlePay = (e) => {
    e.preventDefault();
    setCheckoutStep(2);
    setTimeout(() => {
      clearCart();
      setCheckoutStep(0);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsCartOpen(false); setCheckoutStep(0); }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="cart-drawer glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div className="cart-header">
              <div className="cart-header-title">
                <ShoppingBag size={20} />
                <span>Your Cart</span>
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.reduce((s,i)=>s+i.qty,0)}</span>}
              </div>
              <button className="cart-close-btn" onClick={() => { setIsCartOpen(false); setCheckoutStep(0); }}>
                <X size={20} />
              </button>
            </div>

            {checkoutStep === 2 ? (
              /* Success Screen */
              <motion.div className="cart-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="success-icon"><Check size={40} /></div>
                <h3>Order Placed! 🎉</h3>
                <p>Thank you for your ChillSip order!</p>
                <p className="success-sub">You'll receive a confirmation soon.</p>
              </motion.div>
            ) : checkoutStep === 1 ? (
              /* Checkout Form */
              <div className="cart-body checkout-form-wrapper">
                <form onSubmit={handlePay} className="checkout-form">
                  <h4 className="checkout-section-title">Delivery Details</h4>
                  <input type="text" placeholder="Full Name" required className="checkout-input" />
                  <input type="email" placeholder="Email Address" required className="checkout-input" />
                  <input type="tel" placeholder="Phone Number" required className="checkout-input" />
                  <input type="text" placeholder="Delivery Address" required className="checkout-input" />
                  <h4 className="checkout-section-title" style={{marginTop:'1.5rem'}}>Payment Details</h4>
                  <input type="text" placeholder="Card Number (16 digits)" required className="checkout-input" maxLength={16} />
                  <div className="checkout-row">
                    <input type="text" placeholder="MM/YY" required className="checkout-input" maxLength={5} />
                    <input type="text" placeholder="CVV" required className="checkout-input" maxLength={3} />
                  </div>
                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total</span>
                      <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <button type="submit" className="btn btn-primary checkout-pay-btn">
                      <CreditCard size={18} /> Pay ₹{total.toLocaleString('en-IN')}
                    </button>
                  </div>
                </form>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart */
              <div className="cart-empty">
                <ShoppingBag size={60} opacity={0.2} />
                <p>Your cart is empty</p>
                <span>Add some ChillSip drinks!</span>
              </div>
            ) : (
              /* Cart Items */
              <>
                <div className="cart-body">
                  {cartItems.map(item => (
                    <motion.div layout key={item.id} className="cart-item" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="cart-qty-controls">
                        <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                      </div>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}><X size={14} /></button>
                    </motion.div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <button className="btn btn-primary checkout-pay-btn" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
