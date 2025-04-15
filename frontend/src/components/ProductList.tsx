import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // Массив товаров
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products?page=${page}`);
      setProducts(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Товары</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} name={product.name} price={product.price} image={product.image} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
          disabled={page === 1}
        >
          Назад
        </button>
        <span className="text-xl">Страница {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ProductList;
