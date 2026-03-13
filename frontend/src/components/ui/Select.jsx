import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helper,
  options = [],
  placeholder,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <select ref={ref} className="form-select" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {helper && !error && <span className="form-helper">{helper}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
