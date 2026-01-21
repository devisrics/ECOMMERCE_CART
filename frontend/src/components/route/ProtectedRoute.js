import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../layouts/Loader';

export default function ProtectedRoute({ children, isAdmin }) {
    const { isAuthenticated, loading, user } = useSelector(
        state => state.authState
    );

    // 1️⃣ WAIT until auth check finishes
    if (loading) {
        return <Loader />;
    }

    // 2️⃣ If NOT logged in → redirect
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // 3️⃣ Admin check
    if (isAdmin && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // 4️⃣ Allow access
    return children;
}
