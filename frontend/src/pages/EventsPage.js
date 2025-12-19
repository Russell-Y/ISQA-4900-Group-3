import React, { useEffect, useMemo, useState } from "react";
import { fetchEvents, joinEvent, leaveEvent } from "../api";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);

  const navigate = useNavigate();

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await loadEvents();
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load events");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;

    return events.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const location = (e.location || "").toLowerCase();
      const desc = (e.description || "").toLowerCase();
      const date = (e.date || "").toLowerCase();
      return (
        title.includes(q) ||
        location.includes(q) ||
        desc.includes(q) ||
        date.includes(q)
      );
    });
  }, [events, query]);

  const handleJoin = async (eventId) => {
    try {
      setBusyId(eventId);
      await joinEvent(eventId);
      await loadEvents();
    } catch (err) {
      alert(err.message || "Failed to join event");
    } finally {
      setBusyId(null);
    }
  };

  const handleLeave = async (eventId) => {
    try {
      setBusyId(eventId);
      await leaveEvent(eventId);
      await loadEvents();
    } catch (err) {
      alert(err.message || "Failed to leave event");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="events-container">Loading events...</div>;

  if (error) {
    return (
      <div className="events-container">
        <h1 className="events-title">Upcoming Campus Events</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Campus Events</h1>
      <p className="events-subtitle">
        Discover what’s happening around campus and get involved.
      </p>

      {}
      <div style={{ margin: "14px 0 18px", maxWidth: 520 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by title, location, description, date..."
          style={{ width: "100%", padding: "10px" }}
          autoComplete="off"
        />
        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
          Showing {filteredEvents.length} of {events.length}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events match your search.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => {
            const isBusy = busyId === event.id;
            const isAttending = !!event.is_attending;

            return (
              <div key={event.id} className="event-card">
                <h2>{event.title}</h2>
                <p className="event-meta">
                  {event.date} • {event.time}
                </p>
                <p className="event-location">{event.location}</p>
                <p className="event-description">{event.description}</p>

                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  <button
                    className="event-button"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </button>

                  {isAttending ? (
                    <button
                      className="event-button"
                      onClick={() => handleLeave(event.id)}
                      disabled={isBusy}
                    >
                      {isBusy ? "Leaving..." : "Leave"}
                    </button>
                  ) : (
                    <button
                      className="event-button"
                      onClick={() => handleJoin(event.id)}
                      disabled={isBusy}
                    >
                      {isBusy ? "Joining..." : "Join"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventsPage;