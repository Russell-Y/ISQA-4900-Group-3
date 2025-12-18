import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, setToken } from "../api";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";
  const [imageSrc, setImageSrc] = useState(DEFAULT_AVATAR);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ username, email, password });

      try {
        localStorage.setItem(`profile_avatar:${username}`, imageSrc || DEFAULT_AVATAR);
      } catch {
      }

      const data = await loginUser({ username, password });
      setToken(data.access);

      setPassword("");

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed");
      setPassword(""); // clear immediately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "420px", margin: "0 auto" }}>
      <h2>Sign Up</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "14px" }}>
          <label>Profile Picture</label>
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={imageSrc || DEFAULT_AVATAR}
              alt="Avatar preview"
              style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd" }}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div style={{ flex: 1 }}>
              <input
                value={imageSrc}
                onChange={(e) => setImageSrc(e.target.value)}
                placeholder="Paste an image URL (optional)"
                style={{ width: "100%", padding: "8px" }}
                autoComplete="off"
              />
              <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                Tip: Use a direct image URL (ends in .jpg/.png/.webp).
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Username</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}