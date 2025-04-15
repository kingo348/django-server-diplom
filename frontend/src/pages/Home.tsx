import React from 'react';
import ProductList from '../components/ProductList';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Товары</h1>
      <ProductList />
    </div>
  );
};

export default Home;
