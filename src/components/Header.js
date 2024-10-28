import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header>
      <h1>Dine Smart</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/compare">Compare Prices</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;