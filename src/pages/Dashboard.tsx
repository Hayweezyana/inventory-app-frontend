import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://inventory-app-backend-08mw.onrender.com');

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleNotification = (data: any) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    };
    socket.on('return-notification', handleNotification);
    return () => {
      socket.off('return-notification', handleNotification);
    };
  }, []);

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: '#f9fafb',
    },
    header: {
      fontSize: '1.8rem',
      fontWeight: 700,
    },
    linkContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    link: {
      display: 'block',
    },
    logoutButton: {
      marginTop: '1.5rem',
      backgroundColor: '#dc2626',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      border: 'none',
      cursor: 'pointer',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem',
    },
    statCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    statTitle: {
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    statValue: {
      fontSize: '1.25rem',
      color: '#1f2937',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome, {user?.username}</h1>
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#374151' }}>
        Notifications: {notifications.length} (Unread: {unreadCount})
      </div>

      <div style={styles.linkContainer}>
        {user?.level === 1 && (
          <>
            <Link to="/request" style={{ ...styles.link, color: '#2563eb' }}>
              ➕ Make Request
            </Link>
            <Link to="/myrequests" style={{ ...styles.link, color: '#2563eb' }}>
              📋 My Requests
            </Link>
          </>
        )}

        {user?.level === 2 && (
          <>
            <Link to="/inventory" style={{ ...styles.link, color: '#16a34a' }}>
              📦 Stock Inventory
            </Link>
            <Link to="/approvals" style={{ ...styles.link, color: '#4f46e5' }}>
              ✅ Approve / Return
            </Link>
            <Link to="/flags" style={{ ...styles.link, color: '#dc2626' }}>
              🚩 Flags
            </Link>
            <Link to="/user-management" style={{ ...styles.link, color: '#9333ea' }}>
              👥 User Management
            </Link>
            <Link to="/upload-inventory" style={{ ...styles.link, color: '#ea580c' }}>
              📤 Bulk Upload Inventory
            </Link>
            <Link to="/notifications">
  🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
</Link>

          </>
        )}
      </div>

      <button onClick={logout} style={styles.logoutButton}>
        Logout
      </button>

      {/* Optional stats section (uncomment if needed)
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Total Requests</div>
          <div style={styles.statValue}>42</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Pending Approvals</div>
          <div style={styles.statValue}>10</div>
        </div>
      </div> */}
     
    </div>
  );
};

export default Dashboard;