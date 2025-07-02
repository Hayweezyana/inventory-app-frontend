import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Approvals.css';

type RequestItem = {
  id: number;
  item_id: number;
  name: string;
  quantity_requested: number;
  quantity_returned?: number;
};

type Request = {
  id: number;
  user_id: number;
  status: string;
  user: { id: number; username: string };
  items: RequestItem[];
};

const Approvals: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetch = async () => {
    const res = await api.get('/requests');
    setRequests(res.data);
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id: number) => {
    await api.put(`/requests/${id}/approve`);
    fetch();
  };

  const returnAll = async (id: number) => {
    const req = requests.find((r: any) => r.id === id);
    if (!req) return;
    const returns = req.items.map((item: any) => ({
      item_id: item.item_id,
      quantity_returned: item.quantity_requested,
    }));
    await api.put(`/requests/${id}/return`, { returns });
    fetch();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Approve / Verify Returns</h2>
      {requests.map((r: any) => (
        <div key={r.id} className="border p-3 mb-2">
          <p><strong>Request #{r.id}</strong> by user {r.user?.username ?? 'Unknown'} — Status: {r.status}</p>
          <p className="text-sm text-gray-600">Requested on: {new Date(r.created_at).toLocaleDateString()}</p> 
          <p className="text-sm text-gray-600">Items requested: {r.items.length}</p>
          {r.items.length === 0 && <p className="text-sm text-gray-600">No items requested</p>}
          <ul className="text-sm list-disc ml-5">
            {r.items.map((i: any) => (
              <li key={i.id}>
                {i.item?.name ?? `Item ID: ${i.item_id}`} - Requested: {i.quantity_requested}{" "}
      {i.quantity_returned ? `(Returned: ${i.quantity_returned})` : ''}
              </li>
            ))}
          </ul>
          {r.status === 'pending' && <button onClick={() => approve(r.id)} className="btn">Approve</button>}
          {r.status === 'approved' && <button onClick={() => returnAll(r.id)} className="btn ml-2">Mark Returned</button>}
        </div>
      ))}
    </div>
  );
};

export default Approvals;
