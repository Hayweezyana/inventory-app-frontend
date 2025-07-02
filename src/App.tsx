import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Request from './pages/Request';
import Inventory from './pages/Inventory';
import Approvals from './pages/Approvals';
import Flags from './pages/Flags';
import UploadInventory from './pages/UploadInventory';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import UserManagement from './pages/UserManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowed={[1, 2]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/request" element={
              <ProtectedRoute allowed={[1]}>
                <Request />
              </ProtectedRoute>
            } />
            <Route path="/upload-inventory" element={
              <ProtectedRoute allowed={[2]}>
                <UploadInventory />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute allowed={[2]}>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/approvals" element={
              <ProtectedRoute allowed={[2]}>
                <Approvals />
              </ProtectedRoute>
            } />
            <Route path="/flags" element={
              <ProtectedRoute allowed={[2]}>
                <Flags />
              </ProtectedRoute>
            } />
            <Route path="*" element={<div className="p-4">Page not found</div>} />
            <Route path="/user-management" element={
              <ProtectedRoute allowed={[2]}>
                <UserManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default App;
