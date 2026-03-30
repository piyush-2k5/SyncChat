import { useState, useEffect, useRef } from "react";
import "./App.css";
import socket from "./socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sendError, setSendError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("messageHistory", (history) => {
      setMessages((prev) => {
        if (prev.length > 0) return prev;
        return history;
      });
      setIsLoading(false);
    });

    // receive message
    socket.on("receiveMessage", (messageData) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === messageData._id);
        if (exists) return prev;
        return [...prev, messageData];
      });
    });

    // error handling
    socket.on("messageFailed", ({ error }) => {
      setSendError(error);
      setTimeout(() => setSendError(null), 4000);
    });

    return () => {
      socket.off("messageHistory");
      socket.off("receiveMessage");
      socket.off("messageFailed");
    };
  }, []);

  //  CLEANUP 
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  //  AUTO SCROLL 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  JOIN 
  const handleJoin = () => {
    if (inputText.trim() === "") return;

    const name = inputText.trim();
    setUsername(name);
    setInputText("");
    setIsJoined(true);

    socket.connect(); // 🔥 connect AFTER join
  };

  //  SEND MESSAGE 
  const handleSendMessage = () => {
    if (inputText.trim() === "" || !username) return;

    socket.emit("sendMessage", {
      text: inputText.trim(),
      sender: username,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setInputText("");
  };

  //  ENTER KEY 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!isJoined) handleJoin();
      else handleSendMessage();
    }
  };

  //  JOIN SCREEN 
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

  //  CHAT UI 
  return (
    <div className="chat-app">
      <header className="chat-header">
        <span className="header-logo">💬</span>
        <h2>LiveChat</h2>
        <div className="header-right">
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
          const isMe = msg.sender === username; // 🔥 FIXED

          return (
            <div
              key={msg._id || index}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
              {!isMe && <span className="sender-name">{msg.sender}</span>}

              <div
                className={`message-bubble ${
                  isMe ? "bubble-me" : "bubble-other"
                }`}
              >
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
        <button
          disabled={!inputText.trim()}
          onClick={handleSendMessage}
        >
          Send ↑
        </button>
      </div>
    </div>
  );
}

export default App;