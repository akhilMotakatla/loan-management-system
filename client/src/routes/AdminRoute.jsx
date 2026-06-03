import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['admin','officer'].includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
