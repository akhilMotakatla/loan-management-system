import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-silver text-sm tracking-wide">{label}</label>}
    <input ref={ref} className={`input-luxury ${error ? 'border-ruby focus:border-ruby' : ''} ${className}`} {...props} />
    {error && <span className="text-ruby text-xs">{error}</span>}
  </div>
));
Input.displayName = 'Input';
export default Input;
