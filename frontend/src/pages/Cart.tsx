import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/orderService';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';

type Address = {
  id: number;
  city: string;
  street: string;
  postal_code: string;
};

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [address, setAddress] = useState<Address | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/addresses/', {
          headers: await getAuthHeader(),
        });
        if (res.data.results && res.data.results.length > 0) {
          setAddress(res.data.results[0]);
        }
      } catch (error) {
        console.error('Ошибка при получении адреса:', error);
      }
    };
    fetchAddress();
  }, []);

  const handleOrder = async () => {
    if (!address) {
      alert('Не удалось получить адрес. Убедитесь, что он добавлен в профиле.');
      return;
    }

    try {
      const items = cart.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      const response = await submitOrder(address.id, items);
      console.log('Заказ оформлен:', response);
      clearCart();
      alert('Заказ успешно оформлен!');
    } catch (error) {
      alert('Ошибка при оформлении заказа');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between mb-2">
              <span>
                {item.name}
                {item.size && ` / ${item.size}`}
                {item.color && ` / ${item.color}`}
                × {item.quantity}
              </span>
              <span>{item.price * item.quantity} ₽</span>
              <button
                className="text-red-500 ml-4"
                onClick={() => removeFromCart(item.productId, item.size, item.color)}
              >
                Удалить
              </button>
            </div>
          ))}
          <hr className="my-4" />
          <p className="text-lg font-bold">Итого: {total.toFixed(2)} ₽</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={clearCart}
          >
            Очистить корзину
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 ml-4"
            onClick={handleOrder}
          >
            Оформить заказ
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
