import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  helper,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className={`input-wrapper ${Icon ? 'has-icon' : ''}`}>
        {Icon && <Icon className="input-icon" />}
        <input ref={ref} className="form-input" {...props} />
      </div>
      {error && <span className="form-error">{error}</span>}
      {helper && !error && <span className="form-helper">{helper}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
