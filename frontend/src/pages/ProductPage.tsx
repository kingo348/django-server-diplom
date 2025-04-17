import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductPage: React.FC = () => {
  const { id } = useParams(); // Получаем id товара из URL
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Пока данные загружаются
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-80 object-cover mb-4" />
      <p className="text-lg text-gray-600">{product.description}</p>
      <p className="text-xl font-semibold mt-4">{product.price.toLocaleString()} ₽</p>
    </div>
  );
};

export default ProductPage;
