import axios from 'axios';

const API = 'http://localhost:8000/api';

export const fetchSimilarProducts = async (productId: number) => {
  const res = await axios.get(`${API}/products/${productId}/similar/`);
  return res.data;
};

export const fetchRecommendedProducts = async (productId: number) => {
  const res = await axios.get(`${API}/products/${productId}/recommended/`);
  return res.data;
};

export const searchProductsAuto = async (searchTerm: string, page: number = 1) => {
  const res = await axios.get(`http://localhost:8000/api/search/auto/`, {
    params: { q: searchTerm, page }
  });
  return res.data; // теперь вернёт объект с results, count и т.д.
};

export const fetchManualSortedProducts = async (ordering: string, page: number = 1) => {
  const res = await axios.get(`http://localhost:8000/api/products/manual-sort/`, {
    params: { ordering, page },
  });
  return res.data; 
};