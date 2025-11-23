// frontend/src/api.js

// Mock data for events
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Hackathon Night",
    date: "2025-12-01",
    time: "6:00 PM",
    location: "Student Union Room 201",
    description: "Build something cool in 6 hours with friends.",
  },
  {
    id: 2,
    title: "Study Group: MIS 4900",
    date: "2025-12-03",
    time: "4:30 PM",
    location: "Library 3rd Floor",
    description: "Sprint planning and project work session.",
  },
  {
    id: 3,
    title: "Entrepreneurship Meetup",
    date: "2025-12-05",
    time: "5:00 PM",
    location: "College of Business Atrium",
    description: "Network with students working on startups.",
  },
];

// Mock current user (later, this will come from backend/auth)
const MOCK_USER = {
  username: "test_student",
  email: "student@example.edu",
  major: "Management Information Systems",
  year: "Senior",
};

export async function fetchEvents() {
  // Later: replace this with a real fetch() to your backend
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_EVENTS), 200); // small delay to feel like a real call
  });
}

export async function fetchCurrentUser() {
  // Later: this will use a token and hit /api/user/
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USER), 150);
  });
}