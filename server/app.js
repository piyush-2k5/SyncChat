//  IMPORTS 
const express = require("express");
const cors = require("cors");

const messageRoutes = require("./routes/messages");

//  APP 
const app = express();

app.use(cors());
app.use(express.json());

//  ROUTES 
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app; // ✅ export only