import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CatchAndFill from '../components/games/CatchAndFill';

const CatchGamePage = () => {
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0B0E14' }}>
      <CatchAndFill onClose={() => navigate('/')} />
    </div>
  );
};

export default CatchGamePage;
