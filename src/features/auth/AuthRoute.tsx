import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';

const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default AuthRoute;