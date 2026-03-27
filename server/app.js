// imports
const express = require("express");
const cors = require("cors");

const app = express();

// cors setup
app.use(cors({ origin: "http://localhost:5173" }));

// json parse
app.use(express.json());

// routes
const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

// health route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chat server is running!" });
});

module.exports = app;