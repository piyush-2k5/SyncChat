# SyncChat 💬

A full-stack real-time chat application built using React, Node.js, Express, MongoDB, and Socket.io. It enables instant messaging between multiple users with persistent chat history stored in a database.

---

## 🔗 Live Demo

| | Link |
|---|---|
| **Frontend** | https://your-app.vercel.app |
| **Backend API** | https://your-api.onrender.com |

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Socket.io Client

**Backend**
- Node.js
- Express.js
- Socket.io

**Database**
- MongoDB (Mongoose)

**Deployment**
- Vercel (Frontend)
- Render (Backend)

---

## ✨ Features

- Real-time messaging using Socket.io  
- Persistent chat storage using MongoDB  
- Multi-user group chat  
- Clean and responsive chat UI  
- Auto-scroll to latest messages  
- REST API for fetching message history  
- Error handling for failed messages  

---

## 📁 Project Structure

```
SyncChat/
├── client/     # React frontend
└── server/     # Node.js backend
```

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/piyush-2k5/SyncChat.git
cd SyncChat
```

### 2. Backend setup
```bash
cd server
npm install
node index.js
```

### 3. Frontend setup
```bash
cd ../client
npm install
npm run dev
```

Open: http://localhost:5173

---

## 🔐 Environment Variables

Create a file at `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

---

## 🔌 API Endpoints

- `GET /api/messages` → Fetch messages  
- `POST /api/messages` → Send message  
- `DELETE /api/messages` → Clear messages  

---

## 🚧 Future Improvements

- User authentication (JWT)  
- Private chat (1-to-1 messaging)  
- Typing indicator  
- Online/offline status  
- File & image sharing  

---

## 🧑‍💻 Author

**Piyush Soni**  
- GitHub: https://github.com/piyush-2k5  

---

## 📄 License

This project is open source and available under the MIT License.