// imports
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// get messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message
      .find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("GET error:", error.message);
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
});

// post message
router.post("/", async (req, res) => {
  try {
    const { text, sender, socketId, time } = req.body;

    // validation
    if (!text || !sender) {
      return res.status(400).json({
        success: false,
        error: "text and sender are required",
      });
    }

    // new doc
    const newMessage = new Message({
      text,
      sender,
      socketId: socketId || "unknown",
      time,
    });

    // save
    const saved = await newMessage.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("POST error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: "Save failed" });
  }
});

// delete messages
router.delete("/", async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} messages`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

// export
module.exports = router;