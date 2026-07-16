import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Protected Pages (Shared / Users)
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BrowseChits from './pages/BrowseChits';
import MyActiveChits from './pages/MyActiveChits';
import UserPayments from './pages/UserPayments';

// Admin Pages
import UserApprovals from './pages/admin/UserApprovals';
import ChitApprovals from './pages/admin/ChitApprovals';
import ChitManager from './pages/admin/ChitManager';
import VerifyPayments from './pages/admin/VerifyPayments';
import SystemRecords from './pages/admin/SystemRecords';

// Layout containing Navbar and Sidebar (conditionally)
const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className={user && !isAuthPage ? "main-app-wrapper" : ""}>
      {!isAuthPage && <Navbar />}
      <div style={{ display: 'flex', flex: 1 }} className="main-layout-container">
        {user && !isAuthPage && <Sidebar />}
        <main style={{ flex: 1, padding: isAuthPage ? '0' : '1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      {user && !isAuthPage && <BottomNav />}
      <style>{`
        @media (max-width: 768px) {
          .main-layout-container {
            flex-direction: column !important;
          }
          .main-app-wrapper {
            padding-bottom: 65px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Route protection for signed-in users
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Validating authorization status...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Route protection for superadmins
const AdminRoute = () => {
  const { user } = useAuth();
  
  if (user?.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// Route blocking for guests (e.g. login/register when already signed in)
const GuestRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Guest Auth Routes */}
          <Route element={<GuestRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>

          {/* Publicly Informative Routes (Available to anyone, logged in or out) */}
          <Route element={<MainLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Secure Member / Shared Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* User Only Paths */}
              <Route path="/chits" element={<BrowseChits />} />
              <Route path="/my-chits" element={<MyActiveChits />} />
              <Route path="/payments" element={<UserPayments />} />

              {/* Admin Only Paths */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<UserApprovals />} />
                <Route path="/admin/chit-approvals" element={<ChitApprovals />} />
                <Route path="/admin/chits" element={<ChitManager />} />
                <Route path="/admin/payments" element={<VerifyPayments />} />
                <Route path="/admin/records" element={<SystemRecords />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
