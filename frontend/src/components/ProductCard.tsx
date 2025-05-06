import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoriteService';
import './styles/productCard.css';

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ id, name, price, image }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavorites();
        const found = favorites.some((f: any) => f.product === id);
        setIsFavorite(found);
      } catch (err) {
        console.error('Ошибка при получении избранного', err);
      }
    };
    fetchFavorites();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ productId: id, name, price, quantity: 1 });
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Ошибка при обновлении избранного', err);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img
          src={image || 'default-image.jpg'}
          alt={name}
          className="product-image"
        />
        <div className="product-info">
          <h2>{name}</h2>
          <p>{price.toLocaleString()} ₽</p>
        </div>
      </Link>

      <div className="flex gap-2 mt-2">
        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Добавить в корзину
        </button>
        <button onClick={toggleFavorite} className="text-xl">
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
