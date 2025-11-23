// frontend/src/pages/GroupDetailsPage.js
import React from "react";
import { useParams } from "react-router-dom";

export default function GroupDetailsPage() {
  const { id } = useParams(); // group id from URL later

  // for now, dummy data
  const group = {
    id,
    name: "CSCI 1620 Study Group",
    description: "Study sessions for CSCI 1620 before exams.",
    category: "Study",
    members: ["Abi R.", "Grant D.", "Russell Y."],
  };

  return (
    <div className="page">
      <h1>{group.name}</h1>
      <p>Category: {group.category}</p>
      <p>{group.description}</p>

      <h3>Members</h3>
      <ul>
        {group.members.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <button>Join Group</button>
    </div>
  );
}
