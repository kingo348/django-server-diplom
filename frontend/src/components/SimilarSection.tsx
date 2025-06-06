import React, { useEffect, useState } from 'react';
import { fetchSimilarProducts } from '../services/productService';
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

const SimilarSection: React.FC<Props> = ({ productId }) => {
  const [similar, setSimilar] = useState<Product[]>([]);

  useEffect(() => {
    fetchSimilarProducts(productId)
      .then(setSimilar)
      .catch(console.error);
  }, [productId]);

  if (similar.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Похожие товары</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similar.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default SimilarSection;