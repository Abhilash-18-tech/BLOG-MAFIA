## Plan: Full-Stack Blogging Platform

A scalable, Medium-style blogging platform built with React, Node.js, Express, and MongoDB, featuring user authentication and blog post management.

**Steps**

**Phase 1: Backend Foundation (Parallel with Frontend Foundation)**
1. Initialize Node.js project, install dependencies (Express, Mongoose, bcrypt, jsonwebtoken, dotenv, cors).
2. Set up server structure (`backend/server.js`, `backend/config/db.js`) and connect to MongoDB.

**Phase 2: Database Models**
3. Implement `backend/models/User.js` (username, email, password).
4. Implement `backend/models/Category.js` (name).
5. Implement `backend/models/Post.js` (title, description, content, author ref, category ref).

**Phase 3: Backend Logic (Controllers & Middleware)**
6. Implement `backend/middlewares/auth.js` for JWT verification.
7. Implement `backend/middlewares/errorHandler.js` for centralized error handling.
8. Implement `backend/controllers/authController.js` (register, login).
9. Implement `backend/controllers/categoryController.js` (create, getAll).
10. Implement `backend/controllers/postController.js` (create, get All, get single, update, delete).

**Phase 4: API Routes**
11. Implement `backend/routes/auth.js`.
12. Implement `backend/routes/categories.js`.
13. Implement `backend/routes/posts.js`.
14. Integrate routes into `backend/server.js`.

**Phase 5: Frontend Foundation**
15. Initialize React application using Vite or Create React App.
16. Configure TailwindCSS.
17. Set up folder structure (`frontend/src/components/`, `frontend/src/pages/`, `frontend/src/api/`, `frontend/src/routes/`).

**Phase 6: API Integration & State hooks**
18. Configure Axios instance in `frontend/src/api/axios.js`.
19. Create Auth hook/context for managing JWT state and protected routes.

**Phase 7: Frontend Components**
20. Build `frontend/src/components/Navbar.jsx`.
21. Build `frontend/src/components/Sidebar.jsx` (CategoryFilter).
22. Build `frontend/src/components/PostCard.jsx`.
23. Build `frontend/src/components/Loader.jsx`.

**Phase 8: Frontend Pages & Routing**
24. Build `frontend/src/pages/Register.jsx` and `frontend/src/pages/Login.jsx`.
25. Build `frontend/src/pages/Home.jsx` (List posts, filter by category).
26. Build `frontend/src/pages/CreatePost.jsx` (Protected).
27. Build `frontend/src/pages/PostDetails.jsx`.
28. Set up React Router in `frontend/src/App.jsx` with Protected Routes.

**Relevant files (to be created)**
- `backend/server.js` — Main entry point
- `backend/models/*.js` — Mongoose schemas
- `backend/controllers/*.js` — API logic
- `backend/routes/*.js` — Express routers
- `frontend/src/App.jsx` — React main app & routing
- `frontend/src/api/axios.js` — API configuration
- `frontend/src/pages/*.jsx` — Feature pages

**Verification**
1. Test backend APIs using REST client or Postman (Auth, CRUD operations).
2. Verify MongoDB database collections and relationships.
3. Test frontend authentication flow (Login/Register, token in localStorage, protected route access).
4. Verify CRUD flow in UI (Create post, view post, Edit/Delete restrictions based on author).
5. Verify responsive layout (Medium-style) across mobile and desktop.

**Decisions**
- Separation of backend and frontend into distinct folders (`backend/` and `frontend/`) within the workspace.
- Use JWT stored in localStorage for authentication persistence.
- Clean code architecture for backend (MVC approach without views).
- Only the author can update or delete a post.
