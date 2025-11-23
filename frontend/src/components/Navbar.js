import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      backgroundColor: "#2d3748",
      padding: "15px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2 style={{ margin: 0 }}>ConnectU</h2>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>Home</Link>
        <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>Login</Link>
        <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
         <Link to="/groups" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>Groups</Link>
      </div>
    </nav>
  );
}

export default Navbar;
