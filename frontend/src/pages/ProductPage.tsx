import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:8000/api/products/${id}/`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full max-w-md mb-4" />
      <p className="mb-2">{product.description}</p>
      <p className="text-lg font-semibold mb-6">{product.price.toLocaleString()} ₽</p>

      <ReviewSection productId={product.id} userToken={token} />
    </div>
  );
};

export default ProductPage;
