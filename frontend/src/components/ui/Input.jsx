import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  ...props 
}, ref) => {

  const inputClasses = [
    'form-control',
    error ? 'is-invalid' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input 
        ref={ref}
        type={type}
        className={inputClasses}
        {...props} 
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helperText && !error && <div className="feedback">{helperText}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
