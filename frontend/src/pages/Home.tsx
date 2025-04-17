import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import CategoryFilter from '../components/CategoryFilter';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);

  return (
    <div className="container mx-auto p-4">
      <CategoryFilter
        setSelectedCategory={(id) => {
          setSelectedCategory(id);
          setPage(1);
        }}
      />
      <ProductList
        selectedCategory={selectedCategory}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Home;
