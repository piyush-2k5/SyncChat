// env load
require("dotenv").config();

// imports
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = require("./app");
const initSocket = require("./socket");

// http server
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// init socket
initSocket(io);

// config
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// start server
async function startServer() {
  try {
    console.log("Connecting DB...");

    await mongoose.connect(MONGO_URI);

    console.log("DB connected");

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api/messages`);
      console.log(`Socket ready`);
    });
  } catch (error) {
    console.error("DB error:", error.message);
    process.exit(1);
  }
}

// db events
mongoose.connection.on("disconnected", () => {
  console.warn("DB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("DB reconnected");
});

// run
startServer();