import React, { useEffect, useState } from "react";
import { fetchEvents, createEvent } from "../api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const loadEvents = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      const msg = err.message || "Failed to load events";
      if (msg.toLowerCase().includes("not logged in") || msg.toLowerCase().includes("token")) {
        navigate("/login");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await createEvent({ title, date, time, location, description });
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      await loadEvents();
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="events-container">Loading events...</div>;

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Campus Events</h1>
      <p className="events-subtitle">
        Discover what’s happening around campus and get involved.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "25px" }}>
        <h2>Create an Event</h2>
        <form onSubmit={handleCreate} style={{ maxWidth: "600px" }}>
          <input
            placeholder="Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
            required
          />
          <input
            placeholder="Date (e.g., Dec 18, 2025)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
            required
          />
          <input
            placeholder="Time (optional)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />
          <input
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
            rows={3}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>

      {events.length === 0 ? (
        <p>No events available right now.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p className="event-meta">
                {event.date} {event.time ? `• ${event.time}` : ""}
              </p>
              <p className="event-location">{event.location}</p>
              <p className="event-description">{event.description}</p>
              <button className="event-button" type="button" onClick={() => navigate(`/events/${event.id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;