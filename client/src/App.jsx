import { useState, useEffect, useRef } from "react";
import "./App.css";
import socket, { connectSocket } from "./socket";
import { login, signup, fetchMessages} from "./api";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState("");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [typingUser, setTypingUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef(null);
  let isTyping = false;

  // CONNECT SOCKET AFTER LOGIN
  useEffect(() => {
    if (user?.token) {
      connectSocket(user.token);

      // 🔥 FETCH OLD MESSAGES
      fetchMessages().then((data) => {
        setMessages(data.reverse()); // latest at bottom
        setIsLoading(false);
      });

      // REAL-TIME
      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      socket.on("typing", (username) => {
        setTypingUser(username);
      });

      socket.on("stopTyping", (username) => {
        setTypingUser((prev) =>
          prev === username ? "" : prev
        );
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("stopTyping");
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AUTH
  const handleAuth = async () => {
    const res = isLogin
      ? await login(username, password)
      : await signup(username, password);

    if (res.token) {
      const userData = { username: res.username, token: res.token };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setAuthError("");
    } else {
      setAuthError(res.msg || "Something went wrong");
    }
  };

  // SEND MESSAGE
  const handleSendMessage = () => {
    if (!inputText.trim() || !socket.connected) return;
    socket.emit("sendMessage", {
      text: inputText.trim(),
    });
    socket.emit("stopTyping");
    isTyping = false;

    setInputText("");
  };

  // TYPING
  const handleTyping = () => {
    if (!isTyping) {
      socket.emit("typing");
      isTyping = true;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
  };

  // AUTH UI
  if (!user) {
    return (
      <div className="join-screen">
        <div className="join-card">
          <h2>{isLogin ? "Login" : "Signup"}</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setAuthError("");
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError("");
            }}
          />

          <button onClick={handleAuth}>
            {isLogin ? "Login" : "Signup"}
          </button>

          {authError && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {authError}
            </p>
          )}

          <p>
            {isLogin ? "New user? " : "Already user? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setUsername("");
                setPassword("");
                setAuthError("");
              }}
              style={{
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // CHAT UI
  return (
    <div className="chat-app">
      <header className="chat-header">
        <h2 className="chat-title">SyncChat</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="messages-container">

        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading messages...</span>
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="empty-state">
            No messages yet. Start chatting 👋
          </div>
        )}

        {!isLoading && messages.map((msg, i) => {
          const isMe = msg.sender === user.username;

          return (
            <div
              key={msg._id || i}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
              {!isMe && <span className="sender-name">{msg.sender}</span>}

              <div className={`message-bubble ${isMe ? "bubble-me" : "bubble-other"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}


        <div ref={messagesEndRef} />
      </div>
            {typingUser && (
        <div className="typing-container">
          <p className="typing">{typingUser} is typing...</p>
        </div>
      )}

      <div className="input-area">
        <input
          value={inputText}
          onChange={(e) => {
            const value = e.target.value;
            setInputText(value);

            if (value.trim() === "") {
              socket.emit("stopTyping"); 
              isTyping = false;
            } else {
              handleTyping();
            }
          }}
          onBlur={() => {
            socket.emit("stopTyping"); 
            isTyping = false;
          }}
          placeholder="Enter your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;