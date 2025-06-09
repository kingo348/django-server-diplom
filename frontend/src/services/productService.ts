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

// 👇 Единый универсальный поиск
export const fetchAllSearch = async (
  query: string,
  ordering: string,
  gender: string,
  priceMin: number | undefined,
  priceMax: number | undefined,
  categoryId: number | null,
  page: number
) => {
  const params: any = {
    query,
    ordering,
    page,
  };

  if (gender) params.gender = gender;
  if (priceMin !== undefined) params.price_min = priceMin;
  if (priceMax !== undefined) params.price_max = priceMax;
  if (categoryId !== null) params.category = categoryId;

  const res = await axios.get(`${API}/search/all/`, { params });
  return res.data;
};
