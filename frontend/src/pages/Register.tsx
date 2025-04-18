import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.username?.[0] || 'Ошибка регистрации');
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" placeholder="Имя пользователя" value={form.username} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" required />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
