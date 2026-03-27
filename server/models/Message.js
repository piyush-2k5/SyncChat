// imports
const mongoose = require("mongoose");

// schema
const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    sender: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    socketId: {
      type: String,
      default: "unknown",
    },
    time: {
      type: String,
      default: () =>
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  },
  {
    timestamps: true,
  }
);

// model
const Message = mongoose.model("Message", messageSchema);

// export
module.exports = Message;