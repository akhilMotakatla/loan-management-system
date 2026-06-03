import Spinner from './Spinner.jsx';

export default function Button({ children, variant = 'gold', size = 'md', loading, className = '', ...props }) {
  const variants = {
    gold:    'btn-gold',
    outline: 'btn-outline-gold',
    ghost:   'text-silver hover:text-gold-primary transition-colors',
    danger:  'bg-ruby text-white hover:bg-red-800 transition-colors px-6 py-3 rounded-sm text-sm font-semibold tracking-widest uppercase',
  };
  const sizes = { sm: 'px-4 py-2 text-xs', md: '', lg: 'px-8 py-4 text-base' };
  return (
    <button className={`${variants[variant]} ${sizes[size]} ${className} flex items-center gap-2 justify-center`} disabled={loading} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
