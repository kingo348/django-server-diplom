import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import './styles/productCard.css';

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ id, name, price, image }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ productId: id, name, price, quantity: 1 });
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
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;
