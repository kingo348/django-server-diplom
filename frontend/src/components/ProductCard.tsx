import { Link } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext'; 
import './styles/productCard.css';

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ id, name, price, image }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorite(); 

  const isFavorite = favorites.some((f) => f.product.id === id); 


  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
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
        <Link to={`/product/${id}`}>
          <button className="add-to-cart-btn w-full">
            Подробнее
          </button>
        </Link>
        <button onClick={toggleFavorite} className="text-xl" title="Избранное">
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
