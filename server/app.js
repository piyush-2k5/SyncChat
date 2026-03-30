// ================= IMPORTS =================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const messageRoutes = require("./routes/messages");
const initSocket = require("./socket");
const app = express();
const server = http.createServer(app); // 🔥 REQUIRED

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.error(" DB Error:", err.message));

app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("API running...");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
initSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});