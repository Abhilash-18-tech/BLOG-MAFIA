import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
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
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide Navbar and Footer on landing page for unauthenticated users
  const hideBarsOnLanding = location.pathname === '/' && !user;
  const hideBarsOnAbout = location.pathname === '/about';
  const hideBarsOnAuth = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-otp',
    '/reset-password'
  ].includes(location.pathname);

  return (
    <div className="page-shell flex flex-col items-center tracking-tight">    
      {!hideBarsOnLanding && !hideBarsOnAbout && !hideBarsOnAuth && <Navbar />}
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />      
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />        
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
      {!hideBarsOnLanding && !hideBarsOnAbout && !hideBarsOnAuth && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;