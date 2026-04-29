# BLOG-MAFIA: Full-Stack Project Overview

This document provides a comprehensive overview of the project structure and a step-by-step guide on how this project is implemented from scratch. 

## 🏗️ Project Architecture & Tech Stack

This project is a modern **Full-Stack Web Application** built using the **MERN** stack (MongoDB, Express, React, Node.js) along with Vite for the frontend build tooling.

**Frontend:**
- **Framework:** React + Vite
- **Styling:** CSS
- **API Communication:** Axios
- **Routing:** React Router (implied by the `pages` directory)

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Authentication:** Passport.js / JWT
- **Additional Features:** AI Integration, Real-time Chat, Email Services, File Uploads.

---

## 📂 Complete Project Structure

```text
FULL-STACK-PROJECT/
├── backend/                  # Express/Node.js server
│   ├── config/               # Database connection (db.js) and Passport.js auth strategies
│   ├── controllers/          # Request handlers (AI, Auth, Posts, Chat, Users, etc.)
│   ├── middlewares/          # Custom middlewares (Auth checks, Error handling)
│   ├── models/               # Mongoose schemas (User, Post, Category, Message)
│   ├── routes/               # Express API routes mapping to controllers
│   ├── services/             # Business logic and external API integrations (e.g., ai.service.js)
│   ├── uploads/              # Local storage for user-uploaded media
│   ├── utils/                # Helper functions (e.g., sendEmail.js for OTP/notifications)
│   ├── package.json          # Backend dependencies
│   └── server.js             # Entry point for the backend server
│
├── frontend/                 # React application built with Vite
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── api/              # Axios instances and API call configurations
│   │   ├── assets/           # Images, icons, fonts
│   │   ├── components/       # Reusable UI elements (Navbar, Footer, PostCard, Sidebar, etc.)
│   │   ├── hooks/            # Custom React hooks (e.g., useAuth)
│   │   ├── pages/            # Page-level components corresponding to routes (Home, Login, Dashboard, etc.)
│   │   ├── App.jsx           # Root layout and route definitions
│   │   ├── main.jsx          # React DOM rendering entry point
│   │   └── index.css         # Global CSS styles
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite bundler configuration
└── README.md                 # Project documentation
```

---

## 🚀 How to Implement This Project from Scratch

If you were to build this exact project starting from an empty folder, here is the structured development path.

### Phase 1: Initial Setup
1. **Initialize the Root Workspace:**
   Create the main folder `FULL-STACK-PROJECT`.
   ```bash
   mkdir FULL-STACK-PROJECT
   cd FULL-STACK-PROJECT
   ```

2. **Initialize Backend:**
   Create the server environment.
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken passport multer
   ```
   *Create the base folder structure: `config/`, `controllers/`, `routes/`, `models/`, `middlewares/`, `utils/`, `services/`.*

3. **Initialize Frontend:**
   Scaffold the React app using Vite inside the root directory.
   ```bash
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install axios react-router-dom
   ```

### Phase 2: Backend Development (API Construction)
1. **Server Setup:** 
   Initialize the Express app in `backend/server.js`, configure CORS, body parsers, and connect to MongoDB via `config/db.js`.
2. **Database Modeling:**
   Create Mongoose schemas in `models/`:
   - `User.js` (Auth credentials, profile details)
   - `Post.js` (Title, content, author reference)
   - `Category.js` (For organizing posts)
   - `Message.js` (For the chat feature)
3. **Authentication & Authorization:**
   - Configure `passport.js` or JWT generation in controllers.
   - Build `authController.js` (Register, Login, Send OTP, Verify, Reset Password).
   - Protect routes using `middlewares/auth.js`.
4. **Core Business Logic (Controllers & Routes):**
   - **Users:** Profile management.
   - **Posts:** CRUD operations for articles.
   - **Categories:** Fetching and assigning categories to posts.
   - **Chat:** Saving and retrieving messages.
   - **AI:** Processing data in `ai.service.js` and exposing via `ai.controller.js`.
5. **Utilities:**
   Implement `sendEmail.js` using NodeMailer for OTPs and password resets.

### Phase 3: Frontend Development (React App)
1. **Routing Setup:**
   In `App.jsx`, configure `react-router-dom` to map URLs to UI pages (e.g., `/` -> `Landing.jsx`, `/login` -> `Login.jsx`, `/dashboard` -> `Dashboard.jsx`).
2. **API Integration Wrapper:**
   Setup `src/api/axios.js` to handle base URLs and automatically attach the auth token to headers for protected requests.
3. **Authentication State:**
   Build the `useAuth.jsx` custom hook or a Context state manager to handle user session globally.
4. **Building Pages & Components:**
   - Develop UI layout blocks in `components/` (Navbar, Sidebar, Footer, specific cards like `PostCard`).
   - Wire up individual pages in `pages/` mapping state to the respective backend endpoints via Axios.
5. **Feature Implementation:**
   - **Feed System:** `Home.jsx` pulling all posts.
   - **Post Management:** `CreatePost.jsx`, `EditPost.jsx`, and `MyArticles.jsx` for authors.
   - **Interaction:** `SavedPosts.jsx`, `LikedPosts.jsx`, and `PostDetails.jsx` to view.
   - **Chat System:** Setup WebSocket/Socket.io client on `Chat.jsx`.

### Phase 4: Integration & Polish
1. **CORS & Proxying:** Ensure the frontend correctly speaks to the backend port.
2. **Testing Flows:** Register -> Verify OTP -> Login -> Create Post -> Chat -> Logout.
3. **Error Handling:** Connect the backend's `middlewares/errorHandler.js` to show consistent UI notifications on the frontend.
