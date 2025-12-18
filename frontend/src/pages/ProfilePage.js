// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
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
      <p className="profile-note">
        (Here you will find your profile information)
      </p>
    </div>
  );
}

export default ProfilePage;