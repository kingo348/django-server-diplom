import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';

const Profile: React.FC = () => {
  const token = localStorage.getItem('token');

  const [user, setUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });

  const [address, setAddress] = useState<{
    id: number | null;
    city: string;
    street: string;
    postal_code: string;
  }>({
    id: null,
    city: '',
    street: '',
    postal_code: ''
  });

  const fetchProfile = async () => {
    const res = await axios.get('http://localhost:8000/api/profile/', {
      headers: await getAuthHeader(),
    });
    setUser(res.data);
  };
  const fetchAddress = async () => {
    const res = await axios.get('http://localhost:8000/api/addresses/', {
      headers: await getAuthHeader(),
    });
    if (res.data.results.length > 0) setAddress(res.data.results[0]);
  };

  useEffect(() => {
    fetchProfile();
    fetchAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:8000/api/profile/', user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Данные обновлены');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка при обновлении профиля');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const headers = await getAuthHeader();
      console.log('ОТПРАВЛЯЕМЫЙ АДРЕС:', address);
      const addressData = {
        city: address.city,
        street: address.street,
        postal_code: address.postal_code
      };

      if (address.id) {
        await axios.put(`http://localhost:8000/api/addresses/${address.id}/`, addressData, {
          headers,
        });
      } else {
        const res = await axios.post('http://localhost:8000/api/addresses/', addressData, {
          headers,
        });
        setAddress({ ...res.data, id: res.data.id });
      }

      alert('Адрес сохранён');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка при сохранении адреса');
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post('http://localhost:8000/api/change-password/', {
        old_password: passwords.old,
        new_password: passwords.new,
        confirm_password: passwords.confirm
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Пароль изменён');
      setPasswords({ old: '', new: '', confirm: '' });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка при смене пароля');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Профиль</h2>
      <input name="first_name" value={user.first_name} onChange={handleChange} placeholder="Имя" className="block border p-2 mb-2" />
      <input name="last_name" value={user.last_name} onChange={handleChange} placeholder="Фамилия" className="block border p-2 mb-2" />
      <input name="email" value={user.email} onChange={handleChange} placeholder="Почта" className="block border p-2 mb-4" />
      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Сохранить</button>

      <h3 className="text-xl font-bold mt-8 mb-2">Смена пароля</h3>
      <input type="password" placeholder="Старый пароль" value={passwords.old} onChange={(e) => setPasswords({ ...passwords, old: e.target.value })} className="block border p-2 mb-2" />
      <input type="password" placeholder="Новый пароль" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="block border p-2 mb-2" />
      <input type="password" placeholder="Повторите новый пароль" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="block border p-2 mb-4" />
      <button onClick={handleChangePassword} className="bg-blue-500 text-white px-4 py-2 rounded">Обновить пароль</button>

      <h3 className="text-xl font-bold mt-8 mb-2">Адрес доставки</h3>
      <input name="city" value={address.city} onChange={handleAddressChange} placeholder="Город" className="block border p-2 mb-2" />
      <input name="street" value={address.street} onChange={handleAddressChange} placeholder="Улица" className="block border p-2 mb-2" />
      <input name="postal_code" value={address.postal_code} onChange={handleAddressChange} placeholder="Индекс" className="block border p-2 mb-4" />
      <button onClick={handleSaveAddress} className="bg-blue-500 text-white px-4 py-2 rounded">Сохранить адрес</button>
    </div>
  );
};

export default Profile;
