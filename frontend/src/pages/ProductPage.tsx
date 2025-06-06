import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import RecommendedSection from '../components/RecommendedSection';
import SimilarSection from '../components/SimilarSection';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();
  const token = localStorage.getItem('token');

  const {
    favorites,
    addToFavorites,
    removeFromFavorites
  } = useFavorite();

  const productId = Number(id);
  const isFavorite = favorites.some((f) => f.product.id === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${productId}/`);
        setProduct(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке товара', err);
      }
    };

    if (!isNaN(productId)) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ productId: product.id, name: product.name, price: product.price, quantity: 1 });
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (err) {
      console.error('Ошибка при обновлении избранного', err);
    }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img src={product.image || 'default-image.jpg'} alt={product.name} className="w-full max-w-md mb-4" />
      <p className="mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-6">{product.price.toLocaleString()} ₽</p>

      <div className="flex gap-4 mb-6">
        <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">
          Добавить в корзину
        </button>
        <button onClick={toggleFavorite} className="text-2xl">
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <ReviewSection productId={product.id} userToken={token} />
      <SimilarSection productId={product.id} />
      <RecommendedSection productId={product.id} />
    </div>
  );
};

export default ProductPage;
