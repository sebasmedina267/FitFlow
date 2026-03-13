import { forwardRef } from 'react';

const variants = {
  default: 'icon-btn-default',
  primary: 'icon-btn-primary',
  success: 'icon-btn-success',
  warning: 'icon-btn-warning',
  danger: 'icon-btn-danger'
};

const IconButton = forwardRef(({ 
  icon: Icon, 
  variant = 'default',
  size = 'md',
  tooltip,
  className = '',
  ...props 
}, ref) => {
  return (
    <button 
      ref={ref}
      className={`icon-btn icon-btn-${size} ${variants[variant]} ${className}`}
      title={tooltip}
      {...props}
    >
      <Icon />
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
