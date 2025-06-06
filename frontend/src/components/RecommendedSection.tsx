import React, { useEffect, useState } from 'react';
import { fetchRecommendedProducts } from '../services/productService';
import ProductCard from './ProductCard';

type Props = {
  productId: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const RecommendedSection: React.FC<Props> = ({ productId }) => {
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    fetchRecommendedProducts(productId)
      .then(setRecommended)
      .catch(console.error);
  }, [productId]);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">С этим товаром покупают</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommended.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedSection;
