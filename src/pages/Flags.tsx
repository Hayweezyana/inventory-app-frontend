import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Flags.css';

const Flags: React.FC = () => {
  const [flags, setFlags] = useState([]);
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');

  const fetchFlags = async () => {
    const res = await api.get('/flags');
    setFlags(res.data);
  };

  useEffect(() => { fetchFlags(); }, []);

  const flagUser = async () => {
    await api.post('/flags', { user_id: +userId, reason });
    setUserId('');
    setReason('');
    fetchFlags();
  };

  const resolve = async (id: number) => {
    await api.put(`/flags/${id}/resolve`);
    fetchFlags();
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Flag User</h2>
      <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} className="input mr-2" />
      <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} className="input mr-2" />
      <button onClick={flagUser} className="btn">Flag</button>

      <h3 className="mt-6 font-semibold">All Flags</h3>
      {flags.map((f: any) => (
        <div key={f.id} className="border p-2 my-1">
          User {f.user_id} - {f.reason} [{f.resolved ? 'Resolved' : 'Pending'}]
          {!f.resolved && <button onClick={() => resolve(f.id)} className="ml-2 btn">Resolve</button>}
        </div>
      ))}
    </div>
  );
};

export default Flags;
