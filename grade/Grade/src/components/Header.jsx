import { motion } from 'framer-motion';
import { useCallback } from 'react';

const Header = () => {
  const handleNavClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    // compute offset for sticky header
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerHeight - 12; // small extra gap

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-icon">📊</span>
          <span className="logo-text">GitGrade</span>
        </div>
        
        <nav className="nav">
          <a href="#features" className="nav-link" onClick={handleNavClick}>Features</a>
          <a href="#how-it-works" className="nav-link" onClick={handleNavClick}>How It Works</a>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
