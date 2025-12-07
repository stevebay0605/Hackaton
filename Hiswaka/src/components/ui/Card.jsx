import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant Card réutilisable pour afficher du contenu
 *
 * @param {ReactNode} children - Contenu de la card
 * @param {boolean} hoverable - Effet hover
 * @param {string} to - Lien de navigation (rend la card cliquable)
 * @param {string} variant - 'default' | 'outlined' | 'elevated'
 */
const Card = ({
  children,
  hoverable = false,
  to,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-300';

  const variants = {
    default: 'bg-white border-2 border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-200',
    elevated: 'bg-white shadow-xl border border-gray-100'
  };

  const hoverStyles = hoverable
    ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-gray-300 cursor-pointer'
    : '';

  const cardClasses = `${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={`${cardClasses} block`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Sous-composants pour structurer la Card
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-gray-100 bg-gray-50 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
