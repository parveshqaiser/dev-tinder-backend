# DevTinder Backend 💻❤️

The backend service for **DevTinder** — a platform where developers can discover, connect, become friends, and chat in real time.

---

## 🚀 Features

- 🔐 User Authentication using JWT
- 📧 Email Verification
- 👤 User Profile Management
- 🤝 Send Friend Requests
- ✅ Accept or Reject Friend Requests
- 👥 Friends List Management
- 💬 Real-time Chat with Socket.IO
- 🍪 Secure Cookie Authentication
- 🌐 RESTful APIs

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- Socket.IO

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/parveshqaiser/dev-tinder-backend.git
```

### Navigate to the project

```bash
cd dev-tinder-backend
```

### Install dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

or

```bash
npm start
```

Backend Server:

```
http://127.0.0.1:8000
```

---

## 💬 Socket.IO Server

The chat server runs separately on **Port 9000**.

```javascript
socketServer.listen(9000, () => {
    console.log("Server is Listen at http://127.0.0.1:9000");
});
```

Socket Server URL:

```
http://127.0.0.1:9000
```

---

## 🔄 How DevTinder Works

1. Register an account.
2. Verify your email.
3. Login securely.
4. Browse developer profiles.
5. Send a friend request.
6. Accept the request.
7. Start chatting instantly using Socket.IO.

---

## 🛡️ Security Features

- Password Hashing
- JWT Authentication
- Email Verification
- Account Lock after 5 failed login attempts
- Protected Routes
- Secure Cookies
- Input Validation

---

## 🚀 Future Enhancements

- Online / Offline Status
- Typing Indicator
- Read Receipts
- Push Notifications
- File & Image Sharing
- Voice & Video Calling
- Group Chats
- Search & Recommendation System

---

## ❤️ Tech Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Socket.IO

---

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ for developers looking to connect, collaborate, and maybe even find their perfect coding partner.
