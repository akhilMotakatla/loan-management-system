export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  date ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date)) : '—';

export const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n || 0);

export const initials = (firstName, lastName) =>
  `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
