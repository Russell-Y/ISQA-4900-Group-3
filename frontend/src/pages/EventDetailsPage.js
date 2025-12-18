import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEvent, updateEvent, deleteEvent, fetchCurrentUser } from "../api";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const load = async () => {
    setError("");
    try {
      const [meData, ev] = await Promise.all([fetchCurrentUser(), fetchEvent(id)]);
      setMe(meData);
      setEvent(ev);

      setTitle(ev.title || "");
      setDate(ev.date || "");
      setTime(ev.time || "");
      setLocation(ev.location || "");
      setDescription(ev.description || "");
    } catch (err) {
      setError(err.message || "Failed to load event");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isOwner = me && event && event.created_by_id === me.id;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await updateEvent(id, { title, date, time, location, description });
      setEvent(updated);
    } catch (err) {
      setError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    setSaving(true);
    setError("");
    try {
      await deleteEvent(id);
      navigate("/events");
    } catch (err) {
      setError(err.message || "Failed to delete event");
    } finally {
      setSaving(false);
    }
  };

  if (!event && !error) return <div style={{ padding: "30px" }}>Loading...</div>;

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={() => navigate("/events")}>Back to Events</button>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {event && (
        <>
          <h2 style={{ marginTop: "15px" }}>{event.title}</h2>
          <p>
            <strong>Date:</strong> {event.date} {event.time ? `• ${event.time}` : ""}
          </p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <p style={{ fontSize: "0.9em", opacity: 0.8 }}>
            Created by: {event.created_by_username}
          </p>

          {isOwner ? (
            <>
              <h3>Edit Event</h3>
              <form onSubmit={handleSave} style={{ maxWidth: "600px" }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", marginBottom: 8 }} required />
                <input value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", marginBottom: 8 }} required />
                <input value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
                <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", marginBottom: 8 }} rows={3} />
                <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                <button type="button" onClick={handleDelete} disabled={saving} style={{ marginLeft: 10 }}>
                  Delete Event
                </button>
              </form>
            </>
          ) : (
            <p style={{ marginTop: 20, fontStyle: "italic" }}>
              You can view this event, but only the creator can edit or delete it.
            </p>
          )}
        </>
      )}
    </div>
  );
}