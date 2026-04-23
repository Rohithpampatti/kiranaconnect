import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface ReviewProps {
  productId: string;
  productName: string;
  orderId: string;
  onClose: () => void;
}

const ReviewProduct: React.FC<ReviewProps> = ({ productId, productName, orderId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        productId,
        orderId,
        rating,
        review
      });
      toast.success('Thank you for your review!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold">Rate {productName}</h3>
          <p className="text-gray-500 text-sm mt-1">Share your experience</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={32}
                className={`${
                  (hoverRating || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        {/* Review Text */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review (optional)"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          rows={4}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-xl hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewProduct;