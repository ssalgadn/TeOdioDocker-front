'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  count = 5, 
  initialRating = 0, 
  onRatingChange, 
  size = 20, 
  color = "text-yellow-400", 
  readonly = false 
}) => {
  const [rating, setRating] = useState(Math.round(initialRating));
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index) => {
    if (readonly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (readonly) return;
    const newRating = index;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={starValue}
            size={size}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} ${color}`}
            fill={(hoverRating || rating) >= starValue ? 'currentColor' : 'none'}
            strokeWidth={1.5}
            onMouseEnter={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}

    </div>
  );
};

export default StarRating;
