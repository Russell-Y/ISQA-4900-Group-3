import React, { useEffect, useState } from "react";
import { fetchEvents } from "../api";
import "./EventsPage.css"; // we'll create this next

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="events-container">Loading events...</div>;
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Campus Events</h1>
      <p className="events-subtitle">
        Discover what’s happening around campus and get involved.
      </p>

      {events.length === 0 ? (
        <p>No events available right now.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p className="event-meta">
                {event.date} • {event.time}
              </p>
              <p className="event-location">{event.location}</p>
              <p className="event-description">{event.description}</p>
              <button className="event-button">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;