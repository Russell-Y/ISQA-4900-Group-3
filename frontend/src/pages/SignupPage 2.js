import React, { useState } from "react";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup submitted:", { username, password, confirm });
    // Later connect to backend endpoint /api/register/
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>
        <label>Username:</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        /><br />
        <label>Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        /><br />
        <label>Confirm Password:</label><br />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        /><br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
