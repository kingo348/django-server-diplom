import { Link } from 'react-router-dom';
import './styles/productCard.css';

type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductCard: React.FC<ProductProps> = ({ id, name, price, image }) => {
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
    </div>
  );
};

export default ProductCard;
