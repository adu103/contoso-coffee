import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <h1>☕ Contoso Coffee</h1>
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/store" 
            className={`nav-link ${location.pathname === '/store' ? 'active' : ''}`}
          >
            Store
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
