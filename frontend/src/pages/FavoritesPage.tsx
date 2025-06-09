import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { Link } from 'react-router-dom';

type FavoriteProduct = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number | null;
    image: string | null;
  } | null;
};

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites(); 
        setFavorites(data);
      } catch (err) {
        console.error('Ошибка при получении избранного', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await removeFavorite(productId);
      setFavorites((prev) =>
        prev.filter((fav) => fav.product?.id !== productId)
      );
    } catch (err) {
      console.error('Ошибка при удалении из избранного', err);
    }
  };

  if (loading) return <p className="p-6">Загрузка...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Избранное</h2>
      {favorites.length === 0 ? (
        <p>Список избранного пуст</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((fav) =>
            fav.product ? (
              <div
                key={fav.id}
                className="border p-4 rounded shadow-sm relative"
              >
                <button
                  onClick={() => handleRemove(fav.product!.id)}
                  className="absolute top-2 right-2 text-red-500 text-xl"
                  title="Удалить из избранного"
                >
                  ❌
                </button>
                <Link to={`/product/${fav.product.id}`}>
                  <img
                    src={fav.product.image || 'default-image.jpg'}
                    alt={fav.product.name}
                    className="w-full h-48 object-cover mb-2"
                  />
                  <h3 className="text-lg font-semibold">{fav.product.name}</h3>
                  <p className="text-gray-700">
                    {fav.product.price != null
                      ? fav.product.price.toLocaleString()
                      : '–'} ₽
                  </p>
                </Link>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
