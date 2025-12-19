// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api";
import "./ProfilePage.css";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

// Safety: localStorage size is limited; keep under ~1.5MB to avoid failures
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchCurrentUser()
      .then((data) => {
        if (!mounted) return;
        setUser(data);

        const stored = localStorage.getItem(`profile_avatar:${data.username}`);
        setAvatarUrl(stored || DEFAULT_AVATAR);

        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const persistAvatar = (value) => {
    if (!user?.username) return;
    const v = (value || "").trim() || DEFAULT_AVATAR;

    try {
      localStorage.setItem(`profile_avatar:${user.username}`, v);
    } catch (e) {
      // Most common cause: storage full/quota
      setError("Could not save avatar (storage limit). Try a smaller image.");
      return;
    }

    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 1200);
  };

  const handleSaveAvatarUrl = () => {
    setError("");
    persistAvatar(avatarUrl);
  };

  const handleFileChange = async (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic type check
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    // Size check (avoid blowing localStorage)
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image too large. Please choose an image under ~1.5MB.");
      return;
    }

    // Convert file -> base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setAvatarUrl(dataUrl);     // preview immediately
        persistAvatar(dataUrl);    // save
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file. Try a different image.");
    };
    reader.readAsDataURL(file);

    // allow re-uploading same file if desired
    e.target.value = "";
  };

  const handleResetAvatar = () => {
    setError("");
    setAvatarUrl(DEFAULT_AVATAR);
    persistAvatar(DEFAULT_AVATAR);
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error && !user) {
    return (
      <div className="profile-container">
        <h1>Profile</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h1>Profile</h1>
        <p>You are not logged in yet.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            marginBottom: "14px",
          }}
        >
          <img
            src={avatarUrl || DEFAULT_AVATAR}
            alt="Avatar"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Profile Picture
            </div>

            {/* Upload from computer */}
            <div style={{ marginBottom: 10 }}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Upload an image (under ~1.5MB). Saved to this browser only.
              </div>
            </div>

            {/* Or paste URL */}
            <div style={{ marginBottom: 8 }}>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Or paste an image URL"
                style={{ width: "100%", padding: "8px" }}
                autoComplete="off"
              />
              <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={handleSaveAvatarUrl} style={{ padding: "8px 12px" }}>
                  Save URL
                </button>
                <button onClick={handleResetAvatar} style={{ padding: "8px 12px" }}>
                  Reset
                </button>
                {savedMsg && <span style={{ color: "green" }}>{savedMsg}</span>}
              </div>
            </div>

            {error && (
              <div style={{ color: "red", marginTop: 8 }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="profile-row">
          <span className="label">Username:</span>
          <span>{user.username}</span>
        </div>

        <div className="profile-row">
          <span className="label">Email:</span>
          <span>{user.email}</span>
        </div>

        {user.major && (
          <div className="profile-row">
            <span className="label">Major:</span>
            <span>{user.major}</span>
          </div>
        )}

        {user.year && (
          <div className="profile-row">
            <span className="label">Year:</span>
            <span>{user.year}</span>
          </div>
        )}
      </div>

      <p className="profile-note">(Here you will find your profile information)</p>
    </div>
  );
}

export default ProfilePage;