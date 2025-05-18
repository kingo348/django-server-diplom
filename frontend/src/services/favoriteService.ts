
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';

export const getFavorites = async () => {
  const headers = await getAuthHeader();
  const res = await axios.get('http://localhost:8000/api/favorites/', { headers });
  return res.data.results;
};

export const addFavorite = async (productId: number) => {
  const headers = await getAuthHeader();
  return axios.post('http://localhost:8000/api/favorites/', { product_id: productId }, { headers });
};

export const removeFavorite = async (productId: number) => {
  const headers = await getAuthHeader();
  return axios.delete(`http://localhost:8000/api/favorites/${productId}/`, { headers });
};
