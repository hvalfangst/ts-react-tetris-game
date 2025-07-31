import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTabletDevice = /iPad|Android(?=.*Tablet)|Windows(?=.*Touch)/i.test(userAgent);
      const hasSmallScreen = window.innerWidth <= 768;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsMobile(isMobileDevice && !isTabletDevice && hasSmallScreen);
      setIsTablet(isTabletDevice || (hasTouchScreen && window.innerWidth >= 768 && window.innerWidth <= 1200));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return { 
    isMobile, 
    isTablet, 
    isTouchDevice: isMobile || isTablet,
    isSmallScreen: window.innerWidth <= 768
  };
};