const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export function setToken(token) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = getToken();

  // Build headers safely so Authorization cannot get wiped out
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Force Authorization last
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const message =
      (data && (data.detail || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function registerUser({
  username,
  email,
  password,
  firstName,
  lastName,
}) {
  return request("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      first_name: firstName || "",
      last_name: lastName || "",
    }),
  });
}

export async function loginUser({ username, password }) {
  return request("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchCurrentUser() {
  return request("/api/auth/me/", {
    method: "GET",
  });
}

export async function fetchEvents() {
  return request("/api/events/", {
    method: "GET",
  });
}

export async function createEvent(event) {
  return request("/api/events/", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function fetchEvent(eventId) {
  return request(`/api/events/${eventId}/`, { method: "GET" });
}

export async function updateEvent(eventId, updates) {
  return request(`/api/events/${eventId}/`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteEvent(eventId) {
  return request(`/api/events/${eventId}/`, {
    method: "DELETE",
  });
}