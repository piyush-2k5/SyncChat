// imports
const Message = require("./models/Message");

function initSocket(io) {
  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // load history
    try {
      const history = await Message
        .find()
        .sort({ createdAt: 1 })
        .limit(50);

      socket.emit("messageHistory", history);
    } catch (error) {
      console.error("History error:", error.message);
      socket.emit("messageHistory", []);
    }

    // receive message
    socket.on("sendMessage", async (messageData) => {
      try {
        // save message
        const newMessage = new Message({
          text: messageData.text,
          sender: messageData.sender,
          socketId: socket.id,
          time: messageData.time,
        });

        const saved = await newMessage.save();
        console.log(`Saved: ${saved.sender}`);

        // broadcast
        io.emit("receiveMessage", saved);

      } catch (error) {
        console.error("Save error:", error.message);

        // notify sender
        socket.emit("messageFailed", {
          error: "Message failed",
        });
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

// export
module.exports = initSocket;