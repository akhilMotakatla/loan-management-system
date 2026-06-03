export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-14 h-14' }[size];
  return (
    <div className={`${s} ${className} border-2 border-navy-light border-t-gold-primary rounded-full animate-spin`} />
  );
}
