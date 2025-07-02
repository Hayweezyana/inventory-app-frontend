import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
const { login } = useAuth();
const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', form);
      console.log(res.data);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 shadow">
        <h2 className="text-xl mb-4 font-bold">Login</h2>
        <input name="username" placeholder="Username" onChange={handleChange} className="input mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input mb-2" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
