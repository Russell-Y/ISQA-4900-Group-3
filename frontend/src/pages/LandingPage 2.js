import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to ConnectU</h1>
      <p>Your campus, your community — all in one place.</p>
      <button onClick={() => alert('Get Started clicked!')}>Get Started</button>
    </div>
  );
};

export default LandingPage;
