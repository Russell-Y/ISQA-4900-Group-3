import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, fetchDashboard, clearToken } from "../api";
import "./DashboardPage.css";

function DashboardPage() {
  const [user, setUser] = useState(null);

  const [myGroups, setMyGroups] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [userData, dash] = await Promise.all([
          fetchCurrentUser(),
          fetchDashboard(),
        ]);

        if (!mounted) return;

        setUser(userData);
        setMyGroups(Array.isArray(dash?.groups) ? dash.groups : []);
        setMyEvents(Array.isArray(dash?.events) ? dash.events : []);
      } catch (err) {
        if (!mounted) return;

        const msg = err?.message || "Failed to load dashboard";
        setError(msg);

        if (
          msg.toLowerCase().includes("authentication credentials") ||
          msg.toLowerCase().includes("not logged in") ||
          msg.toLowerCase().includes("token")
        ) {
          try {
            clearToken();
          } catch {}
          navigate("/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myGroups;

    return myGroups.filter((g) => {
      const name = (g.name || "").toLowerCase();
      const cat = (g.category || "").toLowerCase();
      const desc = (g.description || "").toLowerCase();
      return name.includes(q) || cat.includes(q) || desc.includes(q);
    });
  }, [myGroups, query]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myEvents;

    return myEvents.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const loc = (e.location || "").toLowerCase();
      const desc = (e.description || "").toLowerCase();
      const date = (e.date || "").toLowerCase();
      return (
        title.includes(q) || loc.includes(q) || desc.includes(q) || date.includes(q)
      );
    });
  }, [myEvents, query]);

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "12px" }}>
          {error}
        </div>
      )}

      <p className="dashboard-greeting">
        Welcome back, {user?.username || "student"}!
      </p>

      {}
      <div className="dashboard-search-bar" style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Search your groups and events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setQuery("")}
          disabled={!query.trim()}
        >
          Clear
        </button>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Quick Links</h2>
          <div className="dashboard-links">
            <button onClick={() => navigate("/events")}>View Events</button>
            <button onClick={() => navigate("/groups")}>Groups</button>
            <button onClick={() => navigate("/profile")}>My Profile</button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>My Groups</h2>

          {filteredGroups.length === 0 ? (
            <p>{query.trim() ? "No groups match your search." : "You have not joined any groups yet."}</p>
          ) : (
            <ul className="dashboard-events-list">
              {filteredGroups.slice(0, 3).map((g) => (
                <li
                  key={g.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/groups")}
                  title="Go to Groups"
                >
                  <strong>{g.name}</strong>
                  <span>{g.category ? g.category : "Group"}</span>
                  <span className="dashboard-event-location">
                    Members: {g.member_count}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => navigate("/groups")}>Manage Groups</button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>My Events</h2>

          {filteredEvents.length === 0 ? (
            <p>{query.trim() ? "No events match your search." : "No events to show yet."}</p>
          ) : (
            <ul className="dashboard-events-list">
              {filteredEvents.slice(0, 3).map((event) => (
                <li
                  key={event.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/events/${event.id}`)}
                  title="View details"
                >
                  <strong>{event.title}</strong>
                  <span>
                    {event.date ? event.date : ""}
                    {event.time ? ` • ${event.time}` : ""}
                  </span>
                  <span className="dashboard-event-location">
                    {event.location ? event.location : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => navigate("/events")}>Manage Events</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;