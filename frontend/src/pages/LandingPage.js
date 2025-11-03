import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import BackendStatus from "../components/BackendStatus";


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to ConnectU</h1>
      <p>Connecting students across campus through collaboration and events.</p>
      <BackendStatus />
      <div className="button-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}

export default LandingPage;
