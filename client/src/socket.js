import { io } from "socket.io-client";

const socket = io("https://syncchat-1-riku.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = (token) => {
  socket.auth = { token }; // 🔐 send JWT
  socket.connect();
};

export default socket;