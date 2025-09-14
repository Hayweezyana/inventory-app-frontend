import React, { useEffect, useState } from 'react';
import api from '../services/api';
// import { Link } from 'react-router-dom';

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

  // Inline styles
  const styles = {
    container: {
      padding: '2rem',
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '1.5rem',
    },
    form: {
      marginBottom: '1.5rem',
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '0.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formTitle: {
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '0.5rem',
    },
    input: {
      border: '1px solid #e5e7eb',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      outline: 'none',
    },
    select: {
      border: '1px solid #e5e7eb',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      outline: 'none',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    tableContainer: {
      width: '100%',
      border: '1px solid #e5e7eb',
    },
    tableHeaderRow: {
      backgroundColor: '#f3f4f6',
    },
    tableHeaderCell: {
      padding: '0.5rem',
      border: '1px solid #e5e7eb',
    },
    tableCell: {
      padding: '0.5rem',
      border: '1px solid #e5e7eb',
    },
    // Optional styles for potential list-based layout
    userList: {
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      overflow: 'hidden',
    },
    userItem: {
      padding: '1rem',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userItemLast: {
      borderBottom: 'none',
    },
    userActionsButton: {
      marginLeft: '0.5rem',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.3rem 0.7rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      border: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management (Level 2 only)</h2>

      <form onSubmit={handleCreate} style={styles.form}>
        <h3 style={styles.formTitle}>Register New User</h3>
        <div style={styles.formGrid}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={styles.input}
          />
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            style={styles.select}
          >
            <option value="1">Level 1 – Requester</option>
            <option value="2">Level 2 – Manager</option>
          </select>
          <button style={styles.button} type="submit">
            Create User
          </button>
        </div>
      </form>

      <div>
        <h3 style={styles.formTitle}>Registered Users</h3>
        <table style={styles.tableContainer}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeaderCell}>Username</th>
              <th style={styles.tableHeaderCell}>Level</th>
              <th style={styles.tableHeaderCell}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={styles.tableCell}>{u.username}</td>
                <td style={styles.tableCell}>{u.level}</td>
                <td style={styles.tableCell}>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: List-based layout (uncomment if preferred over table) */}
      {/* <div style={styles.userList}>
        {users.map(u => (
          <div key={u.id} style={styles.userItem}>
            <span>{u.username} (Level {u.level})</span>
            <span>{new Date(u.created_at).toLocaleString()}</span>
            <div>
              <button style={styles.userActionsButton}>Edit</button>
              <button style={styles.userActionsButton}>Delete</button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default UserManagement;