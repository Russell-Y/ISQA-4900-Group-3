// frontend/src/pages/GroupsPage.js
import React from "react";

const dummyGroups = [
  { id: 1, name: "CSCI 1620 Study Group", category: "Study", members: 12 },
  { id: 2, name: "UNO Esports Club", category: "Social", members: 25 },
];

export default function GroupsPage() {
  return (
    <div className="page">
      <h1>Groups</h1>
      <div className="groups-grid">
        {dummyGroups.map((g) => (
          <div key={g.id} className="group-card">
            <h2>{g.name}</h2>
            <p>Category: {g.category}</p>
            <p>Members: {g.members}</p>
            <button>View Group</button>
          </div>
        ))}
      </div>
    </div>
  );
}
