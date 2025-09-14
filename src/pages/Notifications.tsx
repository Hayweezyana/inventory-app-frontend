import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    };
    fetchData();
  }, []);

  const markAsRead = async (id: number) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">🔔 Notifications</h2>
      {notifications.map(n => (
        <div key={n.id} className={`p-2 mb-2 border ${n.is_read ? 'bg-gray-100' : 'bg-yellow-100'}`}>
          <p>{n.message}</p>
          <small>{new Date(n.created_at).toLocaleString()}</small>
          {!n.is_read && (
            <button onClick={() => markAsRead(n.id)} className="ml-2 text-sm text-blue-500">Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
