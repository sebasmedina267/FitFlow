import { forwardRef } from 'react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  warning: 'btn-warning',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  outline: 'btn-outline'
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg'
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  block = false,
  fullWidth = false,
  className = '',
  ...props 
}, ref) => {
  const isFullWidth = block || fullWidth;
  const classes = [
    'btn',
    variants[variant],
    sizes[size],
    isFullWidth && 'btn-block',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      ref={ref}
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner" />}
      {Icon && iconPosition === 'left' && !loading && <Icon className="btn-icon" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="btn-icon" />}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
