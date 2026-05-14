import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawYourDrink from '../components/games/DrawYourDrink';

const DrawGamePage = () => {
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0B0E14' }}>
      <DrawYourDrink onClose={() => navigate('/')} />
    </div>
  );
};

export default DrawGamePage;
