import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], placeholder, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-silver text-sm tracking-wide">{label}</label>}
    <select ref={ref} className={`input-luxury ${error ? 'border-ruby' : ''} ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <span className="text-ruby text-xs">{error}</span>}
  </div>
));
Select.displayName = 'Select';
export default Select;
