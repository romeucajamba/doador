import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'donor' | 'hospital';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (allowedRole && user?.role !== allowedRole) {
      // Redirect to their own dashboard if they try to access the wrong area
      navigate(user?.role === 'donor' ? '/donor/dashboard' : '/hospital/dashboard');
    }
  }, [isAuthenticated, user, allowedRole, navigate, location]);

  if (!isAuthenticated || (allowedRole && user?.role !== allowedRole)) {
    return null;
  }

  return <>{children}</>;
};
