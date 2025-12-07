import React from 'react';
import { Lock, Eye, Calendar, Check } from 'lucide-react';

/**
 * Composant Badge réutilisable pour afficher des statuts et informations
 *
 * @param {string} variant - 'public' | 'private' | 'success' | 'warning' | 'error' | 'info'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {ReactNode} children - Contenu du badge
 * @param {boolean} withIcon - Affiche une icône selon le variant
 */
const Badge = ({
  variant = 'info',
  size = 'md',
  children,
  withIcon = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-bold rounded-full';

  const variants = {
    public: 'bg-[#4ba320]/10 text-[#4ba320] border border-[#4ba320]/30',
    private: 'bg-[#e41e12]/10 text-[#e41e12] border border-[#e41e12]/30',
    success: 'bg-[#4ba320]/10 text-[#4ba320] border border-[#4ba320]/30',
    warning: 'bg-[#eee40d]/10 text-[#8a7f08] border border-[#eee40d]/30',
    error: 'bg-[#e41e12]/10 text-[#e41e12] border border-[#e41e12]/30',
    info: 'bg-gray-100 text-gray-700 border border-gray-200',
    processed: 'bg-[#4ba320]/10 text-[#4ba320] border border-[#4ba320]/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const icons = {
    public: <Eye className="w-3.5 h-3.5" />,
    private: <Lock className="w-3.5 h-3.5" />,
    success: <Check className="w-3.5 h-3.5" />,
    processed: <Check className="w-3.5 h-3.5" />,
    info: <Calendar className="w-3.5 h-3.5" />
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {withIcon && icons[variant]}
      {children}
    </span>
  );
};

export default Badge;
