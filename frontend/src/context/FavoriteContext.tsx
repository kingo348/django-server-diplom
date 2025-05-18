import { createContext, useContext, useEffect, useState } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoriteService';

type Favorite = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
};

type FavoriteContextType = {
  favorites: Favorite[];
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data || []);
      } catch (error) {
        console.error('Ошибка при загрузке избранного', error);
      }
    };

    fetchData();
  }, []);

  const addToFavorites = async (productId: number) => {
    try {
      const response = await addFavorite(productId);
      setFavorites((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Ошибка при добавлении в избранное', err);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      await removeFavorite(productId);
      setFavorites((prev) => prev.filter((f) => f.product.id !== productId));
    } catch (err) {
      console.error('Ошибка при удалении из избранного', err);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite должен использоваться внутри FavoriteProvider');
  }
  return context;
};
