import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/categoryFilter.css';

interface Category {
    id: number;
    name: string;
    children?: Category[];
  }
  
  type Props = {
    setSelectedCategory: (id: number | null) => void;
  };
  
  const CategoryFilter: React.FC<Props> = ({ setSelectedCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/categories');
          setCategories(response.data.results);
        } catch (error) {
          console.error('Ошибка при загрузке категорий:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    }, []);
  
    if (loading) return <div className="text-center py-8">Загрузка категорий...</div>;
  
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Категории</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="category-button"
            onClick={() => setSelectedCategory(null)}
          >
            Все товары
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="category-group">
              <button
                className="category-button"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
              {cat.children && cat.children.length > 0 && (
                <div className="category-dropdown">
                  {cat.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="category-subitem"
                      onClick={() => setSelectedCategory(sub.id)}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CategoryFilter;