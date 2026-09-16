import React from 'react';
import solveItLogo from '../../assets/images/solveit-logo.png';
import './Logo.css';

const Logo = () => (
  <a href="#top" className="brand" aria-label="SolveIt - الرئيسية">
    <img src={solveItLogo} alt="SolveIt" />
  </a>
);

export default Logo;
