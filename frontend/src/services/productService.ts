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
