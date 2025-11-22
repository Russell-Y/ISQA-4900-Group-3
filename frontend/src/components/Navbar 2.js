import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  };

  const buttonStyle = {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "10px",
  };

  return (
    <nav style={navStyle}>
      <h2>CampusConnect</h2>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>
          Home
        </Link>
        <Link to="/login">
          <button style={buttonStyle}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={buttonStyle}>Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
