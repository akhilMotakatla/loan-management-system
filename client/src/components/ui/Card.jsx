export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div className={`glass-card rounded-sm p-6 ${glow ? 'shadow-gold' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
