import { useState, useEffect, useRef } from "react";
import { fetchMessages } from "./api";
import "./App.css";
import socket from "./socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // error state
  const [sendError, setSendError] = useState(null);

  const messagesEndRef = useRef(null);

  // socket connect
useEffect(() => {
  socket.connect();

  return () => {
    socket.off();       // remove all listeners
    socket.disconnect();
  };
  }, []);

  // socket events
  useEffect(() => {
    // history
    socket.on("messageHistory", (history) => {
      setMessages(history);
      setIsLoading(false);
    });

    // new message
    socket.on("receiveMessage", (messageData) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === messageData._id);
        if (exists) return prev;
        return [...prev, messageData];
      });
    });

    // error event
    socket.on("messageFailed", ({ error }) => {
      setSendError(error);
      setTimeout(() => setSendError(null), 4000);
    });

    // cleanup
    return () => {
      socket.off("messageHistory");
      socket.off("receiveMessage");
      socket.off("messageFailed");
    };
  }, []);

  // api fallback
  useEffect(() => {
    const load = async () => {
      const data = await fetchMessages();
      if (data && data.length > 0) setMessages(data);
      setIsLoading(false);
    };
    const timer = setTimeout(load, 500);
    return () => clearTimeout(timer);
  }, []);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // join user
  const handleJoin = () => {
    if (inputText.trim() === "") return;
    setUsername(inputText.trim());
    setInputText("");
    setIsJoined(true);
  };

  // send message
  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    socket.emit("sendMessage", {
      text: inputText.trim(),
      sender: username,
      socketId: socket.id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setInputText("");
  };

  // key handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!isJoined) handleJoin();
      else handleSendMessage();
    }
  };

  // join screen
  if (!isJoined) {
    return (
      <div className="join-screen">
        <div className="join-card">
          <div className="join-logo">💬</div>
          <h1>LiveChat</h1>
          <p>Enter your name to start chatting</p>
          <input
            type="text"
            placeholder="Your name..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button onClick={handleJoin}>Join Chat →</button>
        </div>
      </div>
    );
  }

  // chat ui
  return (
    <div className="chat-app">
      <header className="chat-header">
        <span className="header-logo">💬</span>
        <h2>LiveChat</h2>
        <div className="header-right">
          <span className="api-badge db-badge">🍃 MongoDB</span>
          <div className="online-badge">
            <span className="dot"></span> Online
          </div>
        </div>
      </header>

      {/* error toast */}
      {sendError && <div className="error-toast">{sendError}</div>}

      <div className="messages-container">
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading messages...</span>
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="empty-state">No messages yet. Say hello! 👋</div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.socketId === socket.id;

          return (
            <div
              key={msg._id || index}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
              {!isMe && <span className="sender-name">{msg.sender}</span>}
              <div className={`message-bubble ${isMe ? "bubble-me" : "bubble-other"}`}>
                {msg.text}
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send ↑</button>
      </div>
    </div>
  );
}

export default App;