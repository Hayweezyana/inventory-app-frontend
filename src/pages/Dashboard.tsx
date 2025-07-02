import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Welcome, {user?.username}</h1>

      <div className="space-y-3">
        {user?.level === 1 && (
          <>
            <Link to="/request" className="block text-blue-600">➕ Make Request</Link>
            <Link to="/my-requests" className="block text-blue-600">📋 My Requests</Link>
          </>
        )}

        {user?.level === 2 && (
          <>
            <Link to="/inventory" className="block text-green-600">📦 Stock Inventory</Link>
            <Link to="/approvals" className="block text-indigo-600">✅ Approve / Return</Link>
            <Link to="/flags" className="block text-red-600">🚩 Flags</Link>
            <Link to="/user-management" className="block text-purple-600">👥 User Management</Link>
            <Link to="/upload-inventory" className="block text-orange-600">📤 Bulk Upload Inventory</Link>
          </>
        )}
      </div>

      <button onClick={logout} className="mt-6 bg-red-600 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default Dashboard;
