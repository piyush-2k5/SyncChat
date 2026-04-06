const BASE_URL = "https://syncchat-1-riku.onrender.com";

// AUTH

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

export async function signup(username, password) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
}

// MESSAGES

export async function fetchMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}