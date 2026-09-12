import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NikahInvite from './pages/NikahInvite';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import CustomCursor from './components/CustomCursor/CustomCursor';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Router>
        <Routes>
          <Route path="/" element={<NikahInvite />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
