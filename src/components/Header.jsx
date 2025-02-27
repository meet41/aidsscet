import React from 'react';
import './Header.css';
import scetLogo from './scet logo.jpg';
import suLogo from './su logo.png';

function Header() {
  return (
    <div className="container">
      <header className="head">
        <img src={scetLogo} alt="Left Logo" className="logo logo-left" />
        <div className="header-text">
          <h1>Sarvajanik College of Engineering & Technology</h1>
          <h2>Artificial Intelligence and Data Science</h2>
        </div>
        <img src={suLogo} alt="Right Logo" className="logo logo-right" />
      </header>
      <div className="main-content"></div>
    </div>
  );
}

export default Header;