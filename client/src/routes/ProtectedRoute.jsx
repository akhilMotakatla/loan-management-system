import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  // Wait for the refresh-token check to complete before making any routing decision
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
