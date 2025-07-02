import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  level: number;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: '', password: '', level: '1' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      alert('Access denied or fetch failed');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/users', {
        username: form.username,
        password: form.password,
        level: Number(form.level),
      });
      setForm({ username: '', password: '', level: '1' });
      fetchUsers();
      alert('User created');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Create failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management (Level 2 only)</h2>

      <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Register New User</h3>
        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="1">Level 1 – Requester</option>
            <option value="2">Level 2 – Manager</option>
          </select>
          <button className="bg-blue-600 text-white py-2 px-4 rounded mt-2" type="submit">
            Create User
          </button>
        </div>
      </form>

      <div>
        <h3 className="font-semibold mb-2">Registered Users</h3>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.level}</td>
                <td className="p-2 border">{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
