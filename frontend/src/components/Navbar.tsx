import React from 'react';
import { Link } from 'react-router-dom';
import { getUsernameFromToken } from '../utils/auth';

const Navbar: React.FC = () => {
  const username = getUsernameFromToken();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Главная</Link>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="hover:text-blue-500">🛒</Link>

        {username ? (
          <>
            <span className="text-gray-700">Привет, {username}!</span>
            <Link to="/profile" className="hover:text-blue-500">👤</Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="text-red-500 hover:underline"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">Войти</Link>
            <Link to="/register" className="text-blue-500 hover:underline">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
