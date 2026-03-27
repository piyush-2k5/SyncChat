import { io } from "socket.io-client";

const socket = io("https://syncchat-1-riku.onrender.com", {
  autoConnect: false,
  transports: ["websocket"], // prevents polling reconnect spam
});

export default socket;