import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchAllSearch } from '../services/productService';
import './styles/productList.css';

type ProductListProps = {
  selectedCategory: number | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const pageSize = 10;

const ProductList: React.FC<ProductListProps> = ({ selectedCategory, page, setPage }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('price_asc');
  const [totalCount, setTotalCount] = useState<number>(0);

  const [gender, setGender] = useState<string>('');
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchAllSearch(
        searchTerm,
        orderBy,
        gender,
        priceMin,
        priceMax,
        selectedCategory,
        page
      );
      setProducts(result.results);
      setTotalCount(result.count);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, orderBy, selectedCategory, gender, priceMin, priceMax]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="product-list">
      <div className="filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Поиск товаров"
        />

        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="price_asc">Сначала дешёвые</option>
          <option value="price_desc">Сначала дорогие</option>
          <option value="name_asc">По названию A-Z</option>
          <option value="name_desc">По названию Z-A</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Пол не выбран</option>
          <option value="мужской">Мужской</option>
          <option value="женский">Женский</option>
        </select>

        <input
          type="number"
          placeholder="Цена от"
          value={priceMin || ''}
          onChange={(e) => setPriceMin(e.target.value ? parseFloat(e.target.value) : undefined)}
        />
        <input
          type="number"
          placeholder="Цена до"
          value={priceMax || ''}
          onChange={(e) => setPriceMax(e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </div>

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : products.length === 0 ? (
        <div className="text-center">Нет товаров</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Назад
        </button>
        <span>Страница {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={page >= totalPages}>
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default ProductList;
