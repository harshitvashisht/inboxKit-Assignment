# InboxKit — Real-Time Collaborative Grid

A real-time multiplayer grid platform where users can sign up, log in, and claim cells on a shared live board.  
Built with a scalable architecture using Next.js, Express, PostgreSQL, Prisma, Socket.IO, and Docker.

---

# 🚀 Features

- 🔐 User Authentication (Signup/Login)
- ⚡ Real-Time Cell Claiming
- 👥 Multiplayer Shared Grid
- 🟢 Live Updates using Socket.IO
- 🧠 PostgreSQL + Prisma ORM
- 🐳 Dockerized Local Database
- 🎨 Modern Responsive UI
- 🔄 Persistent User Sessions
- 📊 Scalable Backend Architecture
- 🌐 Production-Ready Environment Setup

---

# 🏗️ Tech Stack

## Frontend
- Next.js
- React
- TailwindCSS
- Zustand

## Backend
- Node.js
- Express.js
- WebSockets
- TypeScript

## Database
- PostgreSQL
- Prisma ORM

## DevOps / Deployment
- Docker
- Vercel
- Railway / Neon

---

# 📂 Project Structure

```txt
INBOXKIT/
│
├── apps/
│   ├── web/              # Next.js frontend
│   └── http-backend/     # Express backend
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── docker-compose.yml
│
└── README.md

🔐 Authentication
Password hashing using bcrypt
JWT-based authentication
Secure credential handling
Environment-based secret management

🛡️ Security Considerations
Password hashing with bcrypt
Environment variable isolation
Secure production CORS setup
JWT authentication
Database constraints for consistency

📄 License

MIT License

👨‍💻 Author

Harshit Kumar Upadhyay

GitHub:
https://github.com/harshitvashisht