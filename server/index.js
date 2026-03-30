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
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

initSocket(io);

// ================= CONFIG =================
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// ================= START =================
async function startServer() {
  try {
    console.log("Connecting DB...");

    await mongoose.connect(MONGO_URI); // ✅ FIXED (removed old options)

    console.log("DB connected");

    server.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("DB error:", error.message);
    process.exit(1);
  }
}

// ================= DB EVENTS =================
mongoose.connection.on("disconnected", () => {
  console.warn("DB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("DB reconnected");
});

// ================= RUN =================
startServer();