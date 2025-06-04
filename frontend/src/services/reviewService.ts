import axios from 'axios';

const API = 'http://localhost:8000/api';

export const fetchReviews = async (productId: number) => {
  const response = await axios.get(`${API}/products/${productId}/reviews/`);
  const data = response.data;
  return Array.isArray(data.results) ? data.results : data;
};

export const addReview = async (review: any, token: string) => {
  const response = await axios.post(`${API}/reviews/`, review, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateReview = async (id: number, review: any, token: string) => {
  const response = await axios.put(`${API}/reviews/${id}/`, review, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteReview = async (id: number, token: string) => {
  await axios.delete(`${API}/reviews/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
