import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20',
    secondary: 'bg-bg-card hover:bg-slate-700 text-white border border-white/10',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-text-dim hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg',
  };

  const baseStyles = 'flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
