// imports
const Message = require("./models/Message");
const jwt = require("jsonwebtoken");

function initSocket(io) {

  // 🔐 JWT Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach user
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // receive message
    socket.on("sendMessage", async (messageData) => {
      console.log("MESSAGE RECEIVED:", messageData);
      try {
        if (!messageData.text?.trim()) return;
        const newMessage = new Message({
          text: messageData.text,
          sender: socket.user.username, // SECURE
          socketId: socket.id,
          time: Date.now(),
        });

        const saved = await newMessage.save();

        io.emit("receiveMessage", saved);

      } catch (error) {
        console.error("Save error:", error.message);

        socket.emit("messageFailed", {
          error: "Message failed",
        });
      }
    });

    // typing indicator
    socket.on("typing", () => {
      socket.broadcast.emit("typing", socket.user.username);
    });

    // stop typing indicator
    socket.on("stopTyping", () => {
      socket.broadcast.emit("stopTyping", socket.user.username);
    });

    // disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
}

// export
module.exports = initSocket;