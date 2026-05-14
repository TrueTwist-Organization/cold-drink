import React, { createContext, useContext, useState, useCallback } from 'react';

const DEFAULT = {
  accent:    '#C75F71',
  accentRgb: '199,95,113',
  glowA:     'rgba(199,95,113,0.55)',
  glowB:     'rgba(240,80,120,0.22)',
  ring:      'rgba(199,95,113,0.70)',
  tagClr:    '#F0B8B8',
  name:      'Berry Bliss',
  video:     '/video/home video.mp4',
};

export const PageThemeContext = createContext({
  theme: DEFAULT,
  setTheme: () => {},
});

export const PageThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(DEFAULT);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    /* Also push to CSS custom properties so pure-CSS elements update */
    const r = document.documentElement;
    r.style.setProperty('--page-acc',      t.accent);
    r.style.setProperty('--page-acc-rgb',  t.accentRgb);
    r.style.setProperty('--page-glow-a',   t.glowA);
    r.style.setProperty('--page-tag',      t.tagClr);
    /* Update --primary so glass-badges, btn-primary all match */
    r.style.setProperty('--primary',       t.accent);
    r.style.setProperty('--primary-rgb',   t.accentRgb);
    r.style.setProperty('--rose',          t.accent);
    r.style.setProperty('--blush',         t.tagClr);
  }, []);

  return (
    <PageThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </PageThemeContext.Provider>
  );
};

export const usePageTheme = () => useContext(PageThemeContext);
