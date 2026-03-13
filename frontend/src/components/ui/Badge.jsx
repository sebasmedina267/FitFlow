const Badge = ({ children, variant = 'secondary', className = '' }) => {

  const baseClass = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger'
  };

  const classes = [
    baseClass,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
