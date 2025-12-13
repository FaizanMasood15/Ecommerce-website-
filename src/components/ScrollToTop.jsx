import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Get the current location object, which includes the path, search, and hash
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the window whenever the route/path changes
    window.scrollTo(0, 0);

    // This effect runs every time 'location.pathname' changes
  }, [location.pathname]); 

  // This component doesn't render anything, it just handles the side effect
  return null;
};

export default ScrollToTop;