import React from 'react';
import './Features.css';

const Features = () => {
  const flavors = [
    { title: 'Neon Ice Blue', desc: 'The signature freeze. Invigorating icy blue raspberry with a jolt of energy.', color: 'var(--primary)' },
    { title: 'Cosmic Splash', desc: 'A perfect storm of soft blue berries and chilling mint.', color: 'var(--secondary)' },
    { title: 'Purple Plasma', desc: 'Electric grape and acai infused with neon glow power.', color: 'var(--tertiary)' },
  ];

  return (
    <section id="flavors" className="features">
      <div className="container">
        <h2 className="section-title text-center">SHATTER THE <span className="gradient-text text-glow">ORDINARY</span></h2>
        <div className="flavors-grid">
          {flavors.map((flavor, index) => (
            <div key={index} className="flavor-card glass-panel" style={{ '--card-color': flavor.color, animationDelay: `${index * 150}ms` }}>
              <div className="card-glow"></div>
              <div className="card-image">
                 <img src="/can.png" alt={flavor.title} className="product-can"/>
              </div>
              <div className="card-content">
                <h3 style={{color: flavor.color}}>{flavor.title}</h3>
                <p>{flavor.desc}</p>
                <button className="btn btn-outline glass-btn card-btn">Taste It</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
