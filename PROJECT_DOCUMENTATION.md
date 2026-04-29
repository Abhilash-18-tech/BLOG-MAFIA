# Full-Stack Project: Complete Documentation & Implementation Guide

This document is the ultimate guide to understanding, building, and running this application. It explains the purpose of every part of the architecture, the features it provides, and how the entire project was built from scratch.

---

## 🏗️ 1. Architecture Overview

This project is a modern **Full-Stack Web Application** built using the **MERN** stack (MongoDB, Express, React, Node.js) combined with **Vite** for lightning-fast frontend tooling.

### The Stack:
*   **Database:** MongoDB (using Mongoose for object data modeling)
*   **Backend:** Node.js environment with the Express.js framework
*   **Frontend:** React (scaffolded with Vite)
*   **Styling:** CSS (via `index.css` and local component styles)
*   **API Client:** Axios (for making HTTP requests from React to Node)
*   **Authentication:** JSON Web Tokens (JWT) / Passport.js, with OTP email verification capability.

---

## ✨ 2. Core Features (What this project does)

Based on the file structure, the application includes the following complete feature sets:

### A. Advanced Authentication System
*   **Registration & Login:** Secure user onboarding.
*   **OTP Verification:** Verify user emails via a One-Time Password (`VerifyOtp.jsx`, `utils/sendEmail.js`).
*   **Password Management:** Users can reset passwords (`ForgotPassword.jsx`, `ResetPassword.jsx`).

### B. Blogging / Post Management
*   **CRUD Operations:** Users can Create, Read, Update, and Delete posts (`CreatePost.jsx`, `EditPost.jsx`, `PostDetails.jsx`).
*   **Interactions:** Users can view their own articles (`MyArticles.jsx`), like posts (`LikedPosts.jsx`), and save them for later (`SavedPosts.jsx`).
*   **Categories:** Posts are organized by categories managed by `Category.js` and `categoryController.js`.

### C. Real-Time Chat System
*   **Messaging:** A dedicated chat interface (`Chat.jsx`) communicating with `chatController.js` and storing histories in the `Message.js` model, allowing users to talk to one another.

### D. AI Integration
*   **Smart Features:** AI capabilities powered by `ai.service.js` and `ai.controller.js` (e.g., content generation, moderation, or summarizing posts).

### E. User Profiles
*   **Personalization:** Users have dedicated profiles and settings (`Dashboard.jsx`, `Settings.jsx`, `profileController.js`).
*   **File Uploads:** Backed by local storage or cloud integration inside the `uploads/` directory for avatars or post images.

---

## 🗄️ 3. Database Schema Design (Inferred)

The MongoDB database relies on four distinct collections:
1.  **Users (`models/User.js`):** Stores `username`, `email`, `password` (hashed), `avatar`, `resetToken`, and arrays of object references for `likedPosts` and `savedPosts`.
2.  **Posts (`models/Post.js`):** Contains `title`, `content`, `author` (User ID reference), `category` (Category ID reference), `likesCount`, and timestamps.
3.  **Categories (`models/Category.js`):** Contains `name`, `description`, which maps directly to posts to filter the feed.
4.  **Messages (`models/Message.js`):** Used for the chat feature, storing `sender` (User ID), `receiver` (User ID), `content`, and read receipts.

---

## 🚀 4. Step-by-Step Implementation Guide (How it was built from scratch)

If you wanted to recreate this application entirely from an empty folder, this is the exact roadmap taken to build it:

### Step 1: Workspace Initialization
1. Create the root folder and the two main environments: backend and frontend.
   ```bash
   mkdir FULL-STACK-PROJECT
   cd FULL-STACK-PROJECT
   mkdir backend
   npm create vite@latest frontend -- --template react
   ```

### Step 2: Backend Server & Database Setup (`/backend`)
1. **Initialize Node:** Run `npm init -y` inside `/backend`.
2. **Install Dependencies:** `npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemailer multer`.
3. **Establish Entry Point:** Create `server.js`. This file initializes the Express app, sets up `cors` to allow requests from the React app, configures JSON body-parsing, and listens on a port (e.g., 5000).
4. **Database Connection:** Create `config/db.js` which houses the `mongoose.connect()` function, pulling the MongoDB URI from a `.env` file.

### Step 3: Building Backend Authentication
1. **Model Creation:** Create `models/User.js` with specific required fields and Mongoose validation.
2. **Security:** Implement `bcryptjs` for password hashing before saving the user to the database.
3. **Controllers & Routes:** 
   - Write `controllers/authController.js` logic for `register`, `login`.
   - Create `routes/auth.js` mapping `/api/auth/login` to the login controller.
   - Implement `middlewares/auth.js` to extract and verify the JWT from the `Authorization` header on protected routes.
4. **Email & OTP:** Utilize `nodemailer` inside `utils/sendEmail.js` to dispatch 6-digit verification codes.

### Step 4: Developing Core APIs (Posts, Chat, AI)
1. **Post Services:** Build `models/Post.js`, `controllers/postController.js`, and `routes/posts.js`. Map out logic to handle `GET` (fetch feed), `POST` (create new). Include logic for checking `req.user` (from auth middleware) to associate posts with the author.
2. **File Handling:** Configure `multer` middleware to intercept image uploads and save them physically to the `/uploads` directory or buffer them to cloud storage.
3. **Chat Logic:** Build REST APIs or WebSockets in `chatController.js` to handle saving and fetching messages (`models/Message.js`).
4. **AI Services:** Integrate OpenAI or a similar LLM SDK in `services/ai.service.js`, and create endpoints in `routes/ai.routes.js`.

### Step 5: Frontend Initialization & Routing (`/frontend`)
1. **Cleanup Vite:** Strip out the default Vite boilerplates in `App.jsx` and `index.css`.
2. **Routing Setup:** Install `react-router-dom`. Define the `Browser-Router` and all the `Route` paths in `App.jsx` mapping to the respective files in `/src/pages/` (`Home.jsx`, `Login.jsx`, `Dashboard.jsx`, etc.).
3. **Global Styling:** Setup the base UI rules, CSS variables, and resets inside `index.css`.

### Step 6: Frontend State & API Management
1. **Axios Wrapper:** Create `src/api/axios.js`. Configure a base custom instance (`axios.create`) pointing to `http://localhost:5000/api`. Establish interceptors that automatically attach the `localStorage` JWT token to every outgoing request.
2. **Authentication Hook:** Build `src/hooks/useAuth.jsx`. This likely manages React Context to keep track of whether the user is successfully logged in, providing global access to the `user` object and `logout` function.

### Step 7: Building UI Components & Pages
1. **Layouts:** Create `Navbar.jsx`, `Sidebar.jsx`, and `Footer.jsx`. Wrap them around page content.
2. **Auth Flows:** Build the `Login.jsx` and `Register.jsx` pages with HTML forms. On submit, trigger the Axios POST request and save the resulting token to local storage.
3. **Content Display:** Build the modular `PostCard.jsx` component. In `Home.jsx`, execute a `useEffect` hook to fetch all posts and render a grid of `PostCard` components.
4. **Protected Pages:** Limit access to `Dashboard.jsx`, `CreatePost.jsx`, and `EditPost.jsx` by checking the custom `useAuth` hook. Redirect unauthenticated users back to login.

### Step 8: Finalizing Features & Polish
1. Bind the `Chat.jsx` frontend to the backend's chat endpoints, implement polling or socket events to refresh messages in real-time.
2. Implement loading UI using `Loader.jsx` during network requests.
3. Thoroughly test Edge Cases: Password resets (`ForgotPassword.jsx`), OTP verifications, and what happens when an invalid JWT is sent to the backend.

---

## 💻 5. How to Run the Project Locally

To run this project on a local development machine, you will need two terminal windows.

### Prerequisites:
- Node.js installed
- MongoDB installed locally or an Atlas Cluster URI

### 1. Start the Backend
```bash
cd backend
npm install
# Ensure you have a .env file with PORT, MONGO_URI, JWT_SECRET, EMAIL_USER, etc.
node server.js
# Or 'npm run dev' if nodemon is configured
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The React application will usually start on `http://localhost:5173`, pulling API data from the Express server running on your configured backend port.