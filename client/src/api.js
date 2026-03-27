const BASE_URL = "https://syncchat-1-riku.onrender.com/api";
 
// GET /api/messages — fetch all messages
export async function fetchMessages() {
  try {
    const response = await fetch(`${BASE_URL}/messages`);
    // response.json() reads the body and parses it as JSON
    const data = await response.json();
    return data.data; // our API returns { success, count, data: [...] }
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return []; // return empty array on failure so the app doesn't crash
  }
}
 
// POST /api/messages — save a new message
export async function saveMessage(messageData) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tell the server we're sending JSON
      },
      body: JSON.stringify(messageData), // convert JS object → JSON string
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to save message:", error);
    return null;
  }
}