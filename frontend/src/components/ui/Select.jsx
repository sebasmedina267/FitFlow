import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder,
  className = '',
  ...props 
}, ref) => {

  const selectClasses = [
    'form-control',
    error ? 'is-invalid' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="select-wrapper">
        <select ref={ref} className={selectClasses} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
      {helperText && !error && <div className="feedback">{helperText}</div>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
