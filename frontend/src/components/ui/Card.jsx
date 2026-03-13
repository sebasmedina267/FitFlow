import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  title,
  actions,
  glow = false,
  className = '' 
}, ref) => {

  const classes = [
    'card',
    glow ? 'card-glow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h2>{title}</h2>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
