import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../images/DineSmart_Logo.png'; // Adjust the path as needed

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="DineSmart Logo" className="logo-image" />
        <h1 className="logo-text">DineSmart</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {/* Removed Compare Prices link */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;