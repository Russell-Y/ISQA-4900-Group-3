import React, { useEffect, useMemo, useState } from "react";
import {
  fetchGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup,
} from "../api";

function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // group id being updated/joined/deleted
  const [editingId, setEditingId] = useState(null);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (group) => {
    setEditingId(group.id);
    setEditName(group.name || "");
    setEditCategory(group.category || "");
    setEditDescription(group.description || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCategory("");
    setEditDescription("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createGroup({ name, category, description });
      setName("");
      setCategory("");
      setDescription("");
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to create group");
    }
  };

  const handleJoin = async (groupId) => {
    setError("");
    setBusyId(groupId);
    try {
      await joinGroup(groupId);
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to join group");
    } finally {
      setBusyId(null);
    }
  };

  const handleLeave = async (groupId) => {
    setError("");
    setBusyId(groupId);
    try {
      await leaveGroup(groupId);
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to leave group");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveEdit = async (groupId) => {
    setError("");
    setBusyId(groupId);

    try {
      await updateGroup(groupId, {
        name: editName,
        category: editCategory,
        description: editDescription,
      });
      cancelEdit();
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to update group");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (groupId) => {
    const ok = window.confirm("Delete this group? This cannot be undone.");
    if (!ok) return;

    setError("");
    setBusyId(groupId);

    try {
      await deleteGroup(groupId);
      if (editingId === groupId) cancelEdit();
      await loadGroups();
    } catch (err) {
      setError(err.message || "Failed to delete group");
    } finally {
      setBusyId(null);
    }
  };

  const normalizedGroups = useMemo(() => {
    return groups.map((g) => ({
      ...g,
      memberCount:
        g.members_count ??
        g.member_count ??
        g.memberCount ??
        0,
      isMember: Boolean(g.is_member ?? g.isMember),
      isCreator: Boolean(g.is_creator ?? g.isCreator),
    }));
  }, [groups]);

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading groups...</div>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Groups</h1>
      <p>Join or create clubs, study groups, or organizations.</p>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      {}
      <div style={{ marginBottom: "30px" }}>
        <h3>Create a New Group</h3>
        <form onSubmit={handleCreateGroup}>
          <input
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
            }}
          />
          <input
            placeholder="Category (e.g. Study, Club, Social)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
            }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
            }}
          />
          <button type="submit">Create Group</button>
        </form>
      </div>

      {}
      <h3>Available Groups</h3>

      {normalizedGroups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {normalizedGroups.map((group) => {
            const isEditing = editingId === group.id;
            const isBusy = busyId === group.id;

            return (
              <div
                key={group.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "15px",
                }}
              >
                {!isEditing ? (
                  <>
                    <h4 style={{ marginBottom: "6px" }}>{group.name}</h4>
                    {group.category && (
                      <p style={{ marginTop: 0 }}>
                        <strong>Category:</strong> {group.category}
                      </p>
                    )}
                    {group.description && <p>{group.description}</p>}
                    <p>
                      <strong>Members:</strong> {group.memberCount}
                    </p>

                    {}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {group.isMember ? (
                        <button onClick={() => handleLeave(group.id)} disabled={isBusy}>
                          {isBusy ? "Working..." : "Leave Group"}
                        </button>
                      ) : (
                        <button onClick={() => handleJoin(group.id)} disabled={isBusy}>
                          {isBusy ? "Working..." : "Join Group"}
                        </button>
                      )}

                      {}
                      {group.isCreator && (
                        <>
                          <button onClick={() => startEdit(group)} disabled={isBusy}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(group.id)} disabled={isBusy}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Edit Group</h4>

                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Group name"
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        padding: "8px",
                        width: "100%",
                      }}
                    />
                    <input
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Category"
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        padding: "8px",
                        width: "100%",
                      }}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      style={{
                        display: "block",
                        marginBottom: "10px",
                        padding: "8px",
                        width: "100%",
                      }}
                    />

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button onClick={() => handleSaveEdit(group.id)} disabled={isBusy}>
                        {isBusy ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEdit} disabled={isBusy}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupsPage;