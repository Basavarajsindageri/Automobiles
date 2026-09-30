import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, reviewCount, showCount = true, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${starSizeClass} fill-amber-400`} />
        ))}
        {hasHalfStar && <StarHalf key="half" className={`${starSizeClass} fill-amber-400`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSizeClass} text-slate-300`} />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-slate-500 font-medium">
          {rating.toFixed(1)} {reviewCount ? `(${reviewCount})` : ''}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
