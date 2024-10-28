import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="logo">Dine Smart</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/compare">Compare Prices</Link></li>
          <li><Link to="/account">Account</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;