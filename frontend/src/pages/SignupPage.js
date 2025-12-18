import React, { useState } from "react";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageSrc, setImageSrc] = useState('https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg');

  const handleSignup = (e) => {
    e.preventDefault();
    alert(`Signing up:\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}\nAvatar: ${imageSrc}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <img src={imgSrc} alt={"Avatar"} />
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="imageSrc"
          placeholder="ImageSrc"
          value={imageSrc}
          onChange={(e) => setImageSrc(e.target.value)}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
