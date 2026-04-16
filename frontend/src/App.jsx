import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';
import Settings from './pages/Settings';
import MyArticles from './pages/MyArticles';
import SavedPosts from './pages/SavedPosts';
import LikedPosts from './pages/LikedPosts';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="page-shell flex flex-col items-center tracking-tight">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/my-articles" element={
              <ProtectedRoute>
                <MyArticles />
              </ProtectedRoute>
            } />
            <Route path="/saved-posts" element={
              <ProtectedRoute>
                <SavedPosts />
              </ProtectedRoute>
            } />
            <Route path="/liked-posts" element={
              <ProtectedRoute>
                <LikedPosts />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;