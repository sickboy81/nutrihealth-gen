import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;