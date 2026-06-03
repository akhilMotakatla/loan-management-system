import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['admin', 'officer'].includes(user?.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
