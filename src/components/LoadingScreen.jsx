import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    const tick = () => {
      current += Math.random() * 14 + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 680);
        }, 380);
        return;
      }
      setProgress(current);
      setTimeout(tick, 70 + Math.random() * 60);
    };
    const t = setTimeout(tick, 120);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${exiting ? 'ls-exit' : ''}`}>
      {/* Ambient blobs */}
      <div className="ls-blob ls-blob-1" />
      <div className="ls-blob ls-blob-2" />

      {/* Logo */}
      <div className="ls-logo">
        <span className="ls-chill">Chill</span>
        <span className="ls-sip">Sip</span>
      </div>

      {/* Liquid bottle graphic */}
      <div className="ls-bottle">
        <div className="ls-bottle-body">
          {/* Fill level */}
          <div
            className="ls-liquid"
            style={{ height: `${Math.min(progress, 100)}%` }}
          >
            <div className="ls-wave ls-wave-a" />
            <div className="ls-wave ls-wave-b" />
          </div>

          {/* Bubbles inside bottle */}
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`ls-bottle-bubble ls-bb-${i}`} />
          ))}
        </div>
        <div className="ls-bottle-neck" />
        <div className="ls-bottle-cap" />
      </div>

      {/* Percentage */}
      <div className="ls-percent">{Math.round(Math.min(progress, 100))}%</div>

      {/* Tagline */}
      <p className="ls-tagline">Loading your premium experience…</p>
    </div>
  );
};

export default LoadingScreen;
