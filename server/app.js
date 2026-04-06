const express = require("express");
const cors = require("cors");

const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

//  ROUTES 
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;