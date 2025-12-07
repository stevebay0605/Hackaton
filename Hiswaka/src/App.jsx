import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Donnees from './pages/Donnees';
import DataDetail from './pages/DataDetail';
import AdminDashboard from './pages/AdminDashboard';
import DataAccessRequest from './pages/DataAccessRequest';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Pages sans Layout (Login, Register) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demande" element={<DataAccessRequest />} />

          {/* Pages avec Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/donnees" element={<Donnees />} />
                  <Route path="/donnees/:id" element={<DataDetail />} />
                  
                  {/* Admin protégé */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;