import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/Loader';

export default function ProtectedRoute({ children, isAdmin = false }) {
  const { isAuthenticated, loading, user } = useSelector(
    state => state.auth
  );

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
