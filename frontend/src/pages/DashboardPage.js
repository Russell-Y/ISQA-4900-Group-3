import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, fetchEvents } from "../api";
import "./DashboardPage.css";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const userData = await fetchCurrentUser();
      const eventData = await fetchEvents();
      setUser(userData);
      setEvents(eventData.slice(0, 2)); // show next 2 events
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="dashboard-greeting">
        Welcome back, {user?.username || "student"}!
      </p>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Quick Links</h2>
          <div className="dashboard-links">
            <button onClick={() => navigate("/events")}>View Events</button>
            <button onClick={() => navigate("/profile")}>My Profile</button>
            <button onClick={() => navigate("/signup")}>Invite a Friend</button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p>No events yet. Check back soon!</p>
          ) : (
            <ul className="dashboard-events-list">
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong>
                  <span>
                    {event.date} • {event.time}
                  </span>
                  <span className="dashboard-event-location">
                    {event.location}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="dashboard-footer-note">
        <p>
          (Later this will show your joined groups, saved events, and
          notifications from the backend.)
        </p>
      </section>
    </div>
  );
}

export default DashboardPage;