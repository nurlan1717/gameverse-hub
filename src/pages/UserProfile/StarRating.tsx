
import React from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    isDisabled: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, isDisabled }) => {
    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={starValue}
                        type="button"
                        className={`text-2xl ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'} ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                        onClick={() => !isDisabled && onRatingChange(starValue)}
                        disabled={isDisabled}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;