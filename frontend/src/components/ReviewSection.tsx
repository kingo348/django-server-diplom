import React, { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview
} from '../services/reviewService';
import './styles/reviewSection.css';

type Review = {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
};

type Props = {
  productId: number;
  userToken: string | null;
};

type DecodedToken = {
  user_id: number;
  username: string;
};

const ReviewSection: React.FC<Props> = ({ productId, userToken }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const currentUsername = (() => {
    if (!userToken) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(userToken);
      return decoded.username;
    } catch {
      return null;
    }
  })();

  const loadReviews = async () => {
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const userOwnReview = useMemo(() => {
    return reviews.find((r) => r.user === currentUsername);
  }, [reviews, currentUsername]);

  const handleSubmit = async () => {
    if (!userToken) return;

    const review = {
      product: productId,
      rating,
      comment,
    };

    try {
      if (editingReviewId) {
        const updated = await updateReview(editingReviewId, review, userToken);
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReviewId ? updated : r))
        );
        setEditingReviewId(null);
      } else {
        const created = await addReview(review, userToken);
        setReviews((prev) => [...prev, created]);
      }

      setComment('');
      setRating(5);
    } catch (error) {
      alert('Ошибка при отправке отзыва');
    }
  };

  const handleDelete = async (id: number) => {
    if (!userToken) return;
    await deleteReview(id, userToken);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setComment('');
    setEditingReviewId(null);
  };

  const handleEdit = (review: Review) => {
    setComment(review.comment);
    setRating(review.rating);
    setEditingReviewId(review.id);
  };

  return (
    <div className="review-container">
      <h2 className="text-xl font-bold mb-4">Отзывы</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">Пока нет отзывов</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review-card">
              <p className="review-meta">{r.user} — {r.rating}★</p>
              <p className="mb-1">{r.comment}</p>
              <p className="review-date">{new Date(r.created_at).toLocaleString()}</p>
              {r.user === currentUsername && (
                <div className="review-actions">
                  <button onClick={() => handleEdit(r)} className="edit-btn">Редактировать</button>
                  <button onClick={() => handleDelete(r.id)} className="delete-btn">Удалить</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {userToken && (!userOwnReview || editingReviewId) && (
        <div className="review-form">
          <h3 className="text-lg font-semibold mb-2">
            {editingReviewId ? 'Редактировать отзыв' : 'Оставить отзыв'}
          </h3>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Ваш комментарий"
          />
          <button onClick={handleSubmit}>
            {editingReviewId ? 'Обновить' : 'Отправить'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
