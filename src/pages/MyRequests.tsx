import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = (user as any)?.token;
        const res = await axios.get('/my', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        console.log("API response:", res.data);
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  if (loading) return <p>Loading your requests...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 My Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul>
          {requests.map((req: any) => (
            <li key={req.id}>
              {req.item?.name} - {req.status} (requested on{' '}
              {new Date(req.created_at).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
