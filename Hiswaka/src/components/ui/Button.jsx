import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant Button réutilisable avec variantes HISWAKA
 *
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Affiche un loader
 * @param {boolean} disabled - Désactive le bouton
 * @param {ReactNode} children - Contenu du bouton
 * @param {ReactNode} icon - Icône à afficher
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[#4ba320] to-[#2d6713] text-white hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#4ba320]',
    secondary: 'bg-[#eee40d] text-gray-900 hover:bg-[#d9d10c] hover:shadow-md focus:ring-[#eee40d]',
    outline: 'border-2 border-gray-200 text-gray-700 hover:border-[#4ba320] hover:bg-gray-50 focus:ring-[#4ba320]',
    danger: 'bg-[#e41e12] text-white hover:bg-[#c71a0f] hover:shadow-lg focus:ring-[#e41e12]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
