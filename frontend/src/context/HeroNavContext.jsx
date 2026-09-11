import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HeroNavContext = createContext({
  isHome: false,
  isHeroInView: false,
  setIsHeroInView: () => {},
});

export const HeroNavProvider = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isHeroInView, setIsHeroInView] = useState(isHome);

  // Synchronize route changes
  useEffect(() => {
    if (!isHome) {
      setIsHeroInView(false);
      document.body.classList.remove('is-home-page', 'home-hero-active');
    } else {
      document.body.classList.add('is-home-page');
      // When at top of home, hero is in view
      const atTop = window.scrollY < 120;
      setIsHeroInView(atTop);
      if (atTop) {
        document.body.classList.add('home-hero-active');
      } else {
        document.body.classList.remove('home-hero-active');
      }
    }
  }, [isHome, location.pathname]);

  // Synchronize body class for home-hero-active
  useEffect(() => {
    if (isHome && isHeroInView) {
      document.body.classList.add('home-hero-active');
    } else {
      document.body.classList.remove('home-hero-active');
    }
  }, [isHome, isHeroInView]);

  return (
    <HeroNavContext.Provider value={{ isHome, isHeroInView, setIsHeroInView }}>
      {children}
    </HeroNavContext.Provider>
  );
};

export const useHeroNav = () => useContext(HeroNavContext);
