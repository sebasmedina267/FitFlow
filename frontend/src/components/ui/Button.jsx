import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {

  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    lg: 'btn-lg'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    size && sizeClasses[size],
    loading ? 'loading' : '',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {LeftIcon && <LeftIcon className="btn-icon-left" />}
      {children}
      {RightIcon && <RightIcon className="btn-icon-right" />}
    </>
  );

  return (
    <button 
      ref={ref}
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="btn-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
