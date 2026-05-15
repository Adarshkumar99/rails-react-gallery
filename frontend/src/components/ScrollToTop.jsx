import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top on pathname change
  }, [pathname]); // dependency array ensures this runs on route change

  return null; // this component doesn't render anything visible
}

export default ScrollToTop;