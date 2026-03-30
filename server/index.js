require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = require("./app");
const initSocket = require("./socket");

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

// ================= CONFIG =================
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

console.log("PORT:", PORT);

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

// ================= CONNECT DB =================
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB error:", err.message));

// ================= DB EVENTS =================
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ DB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔁 DB reconnected");
});